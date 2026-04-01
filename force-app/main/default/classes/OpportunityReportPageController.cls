public with sharing class OpportunityReportPageController {

    @AuraEnabled
    public static List<Opportunity> getOpportunitiesServer(Map<String, String> params) {
        String budgetYear = params.get('budgetYear');

        String s = 'SELECT Id, Name, FiscalYear, Amount, StageName, Description, CloseDate ';
        String f = ' FROM Opportunity';
        String w = ' WHERE Id != NULL ';
        String o = ' ORDER BY Name ';

        if (!String.isEmpty(budgetYear) && budgetYear != 'all') {
            w += ' AND FiscalYear = ' + Integer.valueOf(budgetYear) + ' ';
        }

        return Database.query(s + f + w + o);
    }

    @AuraEnabled
    public static void deleteOpportunity(Id recordId) {
        delete [SELECT Id FROM Opportunity WHERE Id = :recordId];
}

}