# Opportunity Report (Salesforce LWC)

Test task for **Junior JavaScript (Salesforce) Developer** position at CloudBudget.

---

## 🚀 Features

- Opportunity table (LWC datatable)
- Filtering:
  - Year
  - Stage
  - Close Date
- Sorting by columns
- Dynamic total calculation
- Row actions:
  - Edit (opens standard Salesforce edit page)
  - Delete (via Apex)
- Export to CSV (based on filtered data)

---

## 🛠 Tech Stack

- **Salesforce LWC (Lightning Web Components)**
- **Apex (server-side logic)**
- JavaScript (ES6)

---

## ⚙️ How it works

- Data is fetched from Salesforce via Apex controller
- Filtering is handled on client-side (LWC)
- Sorting is implemented manually in JS
- Delete action calls Apex method and refreshes data
- Export generates CSV from currently visible (filtered) records

---

## ⚠️ Notes

- CSV export works correctly in Edge  
- In Chrome, download may be blocked due to browser security restrictions in Lightning environment

---

## 👨‍💻 Author

Dauren