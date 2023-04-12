({
    addNomineeRecord: function(component, event) {
        //get the account List from component
        component.set("v.nomineeId",'');
        component.set("v.nomiFName",'');
        component.set("v.nomiLName",'');  
        var nomineeList = component.get("v.nomineeList");
        console.log('nomineeListSize--------->',nomineeList.length);
        
        component.set("v.indexValue",nomineeList.length);
        //Add New Account Record
        nomineeList.push({
            'sobjectType': 'Nominee__c',
            'Name': '',
            'Narne_First_Name__c': '',
            'Narne_Last_Name__c': '',
            'nomineeId':''
        });
        component.set("v.nomineeList", nomineeList);
    },
    saveNomineeList: function(component, event, helper,recordId) {
        try{
            //Call Apex class and pass account list parameters
            //let nomWrapList = component.get("v.nomineeWrapperList");
            let nomWrapList = component.get("v.nomineeList");            
            let wrapStr = JSON.stringify(nomWrapList);
            console.log("v.nomineeId",component.get("v.nomineeId"));
            console.log('wrapStr------>',wrapStr);
            console.log('nomrecordId0------>',recordId);
            console.log('nomrecordId2------>',component.get("v.recordId"));
            var action = component.get("c.updateNominees");
            action.setParams({
                "nomList": wrapStr,
                "memberId": recordId
                //"nomIdList": nomIdWrap
            });
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    component.set("v.nomineeList", []);
                    //alert('Account records saved successfully');
                }
            }); 
            $A.enqueueAction(action);
        }catch(e){
            console.log('catchError------>',e);
        }
        
    }
})
