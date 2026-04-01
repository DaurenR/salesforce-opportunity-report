import { LightningElement, track } from "lwc";
import getOpportunitiesServer from "@salesforce/apex/OpportunityReportPageController.getOpportunitiesServer";
import deleteOpportunity from "@salesforce/apex/OpportunityReportPageController.deleteOpportunity";

export default class OpportunityReport extends LightningElement {
  @track opportunities = [];
  @track allOpportunities = [];

  budgetYear = "2024";
  selectedStage = "";
  selectedCloseDate = "";

  showSpinner = false;

  columns = [
    { label: "Name", fieldName: "Name", sortable: true },
    { label: "Fiscal Year", fieldName: "FiscalYear", sortable: true },
    { label: "Amount", fieldName: "Amount", type: "currency", sortable: true },
    { label: "Stage", fieldName: "StageName", sortable: true },
    { label: "Description", fieldName: "Description" },
    {
      label: "Close Date",
      fieldName: "CloseDate",
      type: "date",
      sortable: true,
    },
    {
      type: "action",
      typeAttributes: {
        rowActions: [
          { label: "Edit", name: "edit" },
          { label: "Delete", name: "delete" },
        ],
      },
    },
  ];

  get yearOptions() {
    const currentYear = new Date().getFullYear();
    const options = [{ label: "All Years", value: "all" }];
    for (let i = -2; i <= 2; i++) {
      const year = (currentYear + i).toString();
      options.push({ label: year, value: year });
    }
    return options;
  }

  get stageOptions() {
    return [
      { label: "All", value: "" },
      { label: "Prospecting", value: "Prospecting" },
      { label: "Qualification", value: "Qualification" },
      { label: "Closed Won", value: "Closed Won" },
      { label: "Closed Lost", value: "Closed Lost" },
    ];
  }

  connectedCallback() {
    this.doInit();
  }

  handleChange(event) {
    this.budgetYear = event.detail.value;
    this.doInit();
  }

  handleStageChange(event) {
    this.selectedStage = event.detail.value;
    this.applyFilters();
  }

  handleDateChange(event) {
    this.selectedCloseDate = event.detail.value;
    this.applyFilters();
  }

  handleSort(event) {
    const field = event.detail.fieldName;
    const direction = event.detail.sortDirection;

    let data = [...this.opportunities];

    data.sort((a, b) => {
      let valA = a[field] || "";
      let valB = b[field] || "";

      return direction === "asc"
        ? valA > valB
          ? 1
          : -1
        : valA < valB
          ? 1
          : -1;
    });

    this.opportunities = data;
  }

  handleRowAction(event) {
    const actionName = event.detail.action.name;
    const row = event.detail.row;

    if (actionName === "edit") {
      window.open(`/lightning/r/Opportunity/${row.Id}/edit`, "_blank");
    }

    if (actionName === "delete") {
      if (confirm("Delete this record?")) {
        this.deleteOpportunity(row.Id);
      }
    }
  }

  handleExport() {
  console.log('EXPORT CLICK');

  const headers = ['Name', 'FiscalYear', 'Amount', 'Stage', 'CloseDate'];

  const rows = this.opportunities.map(item => [
    item.Name,
    item.FiscalYear,
    item.Amount,
    item.StageName,
    item.CloseDate
  ]);

  let csvContent = headers.join(',') + '\n';

  rows.forEach(row => {
    csvContent += row.join(',') + '\n';
  });

  const encodedUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);

  const link = document.createElement('a');
  link.href = encodedUri;
  link.download = 'opportunities.csv';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

  async deleteOpportunity(id) {
    try {
      await deleteOpportunity({ recordId: id });
      this.doInit(); // обновляем таблицу
    } catch (e) {
      console.error(e);
    }
  }

  async doInit() {
    try {
      this.showSpinner = true;
      const params = { budgetYear: this.budgetYear };
      this.allOpportunities = await getOpportunitiesServer({ params });
      this.applyFilters();
    } catch (e) {
      console.error(e);
    } finally {
      this.showSpinner = false;
    }
  }

  applyFilters() {
    let data = [...this.allOpportunities];

    if (this.selectedStage) {
      data = data.filter((item) => item.StageName === this.selectedStage);
    }

    if (this.selectedCloseDate) {
      data = data.filter((item) => item.CloseDate === this.selectedCloseDate);
    }

    this.opportunities = data;
  }

  get totalAmount() {
    return this.opportunities.reduce(
      (sum, item) => sum + (item.Amount || 0),
      0
    );
  }
}