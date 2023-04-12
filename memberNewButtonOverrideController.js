({
    doInit: function(cmp,evt) {
        cmp.set("v.isModalOpen", true); 
        var memId=cmp.get("v.memId"); 
        console.log('memId'+memId);
        cmp.set("v.ContactWrapper",{});
        var myPageRef = cmp.get("v.pageReference");
        console.log('myPageRef----'+JSON.stringify(myPageRef));
        var state = myPageRef.state; 
        var base64Context = state.inContextOfRef;
        if (base64Context.startsWith("1\.")) {
            base64Context = base64Context.substring(2);
        }
        var addressableContext = JSON.parse(window.atob(base64Context));
        console.log('addressableContext--'+JSON.stringify(addressableContext));
        var primarymemberId=addressableContext.attributes.recordId;
        var primarymemDupId=addressableContext.attributes.recordId;
        console.log('primarymemberId--'+primarymemberId);
        cmp.find("primarymemberLookupId").fireChanging(addressableContext.attributes.recordId);
        cmp.set("v.primarymemberId",primarymemberId);
        cmp.set("v.primarymemDupId",primarymemDupId);
        console.log("primarymemberId--->@@",cmp.get("v.primarymemberId"));
    },
    reInit : function(component, event, helper) {
        $A.get('e.force:refreshView').fire();
    },
    // function automatic called by aura:waiting event  
    showSpinner: function(component, event, helper) {
        // remove slds-hide class from mySpinner
        var spinner = component.find("mySpinner");
        $A.util.removeClass(spinner, "slds-hide");
    },
    // function automatic called by aura:doneWaiting event 
    hideSpinner : function(component,event,helper){
        // add slds-hide class from mySpinner    
        var spinner = component.find("mySpinner");
        $A.util.addClass(spinner, "slds-hide");
    },
    searchContact:function(component,event,helper){
        let mPhone = component.find("mobilePhone").get("v.value");
        let emailId = component.find("emailid").get("v.value");
        var action = component.get("c.searchContactMethod");
        action.setParams({
            mPhone : mPhone,
            emailId : emailId    
        });                 
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS"){
                let resp = response.getReturnValue();
                component.set("v.contactRecordList",response.getReturnValue());
                console.log(component.get("v.contactRecordList"))
                if(resp.length>0 && resp){
                    component.set("v.showConLink",true);
                }
            }
        });
        $A.enqueueAction(action);
    },
    selectContactType: function(cmp, evt) {
        try{
            let val = evt.getSource().get('v.checked');
            
            if(val == true){
                cmp.set("v.showSearch",val);                
            }
            if(val==false){
                cmp.set("v.showSearch",val);
                cmp.set("v.showConLink",val);
                cmp.set("v.contactId",'');
                cmp.set("v.ContactWrapper.conSalutation",'');
                cmp.set("v.ContactWrapper.conFname",'');
                cmp.set("v.ContactWrapper.conMname",'');
                cmp.set("v.ContactWrapper.conLname",'');
                cmp.set("v.ContactWrapper.conGender",'');
                cmp.set("v.ContactWrapper.conDOB",'');
                cmp.set("v.ContactWrapper.conOccupation",'');
                cmp.set("v.ContactWrapper.conMobile1",'');
                cmp.set("v.ContactWrapper.conMobile2",'');
                cmp.set("v.ContactWrapper.conEmail1",'');
                cmp.set("v.ContactWrapper.conEmail2",''); 
            }
        }catch(e){
            
        }
    },
    updateContactLookup : function(component,event, helper) {
        try{
            console.log("123");
            let index = event.target.dataset.id;
            let conList = component.get("v.contactRecordList");
            let conRecord = conList[index];
            component.set("v.hide",true);
            component.set("v.contactId",conRecord.Id);
            component.find("contactLookupId").fireChanging(conRecord.Id);
            let conWrap = component.get("v.ContactWrapper");
            console.log("conwrap-->",conWrap)
            conWrap.conSalutation = conRecord.Salutation;
            conWrap.conFname = conRecord.FirstName;
            conWrap.conMname = conRecord.MiddleName;
            conWrap.conLname = conRecord.LastName;
            conWrap.conGender = conRecord.Narne_Gender__c;
            conWrap.conDOB = conRecord.Narne_Date_of_Birth__c;
            conWrap.conOccupation = conRecord.Narne_Occupation__c;
            conWrap.conMobile1 = conRecord.MobilePhone;
            conWrap.conMobile2 = conRecord.Narne_Mobile_2__c;
            conWrap.conEmail1 = conRecord.Email;
            conWrap.conEmail2 = conRecord.Narne_Email_2__c;
            conWrap.conDefence = conRecord.Defence__c;
            
            //For Mapping Current Address
            conWrap.conCurArea = conRecord.Narne_Present_Area__c;
            conWrap.conCurHouse = conRecord.Narne_Present_House_No__c;
            conWrap.conCurLandmark = conRecord.Narne_Present_Landmark__c;
            conWrap.conCurPincode = conRecord.Narne_Present_Pincode__c;
            conWrap.conCurState = conRecord.Narne_Current_State__c;
            conWrap.conCurStreet = conRecord.Narne_Present_Street__c;
            conWrap.conCurVillage = conRecord.Narne_Present_City__c;
            conWrap.conCurCountry = conRecord.Narne_Current_Country__c;
            
            //For Mapping Permanent Address
            conWrap.conPerArea = conRecord.Narne_Permanent_Area__c;
            conWrap.conPerHouse = conRecord.Narne_Permanent_House_No__c;
            conWrap.conPerLandmark = conRecord.Narne_Permanent_Landmark__c;
            conWrap.conPerPincode = conRecord.Narne_Permanent_Pincode__c;
            conWrap.conPerState = conRecord.Narne_Permanent_State__c;
            conWrap.conPerStreet = conRecord.Narne_Permanent_Street__c;
            conWrap.conPerVillage = conRecord.Narne_Permanent_City__c;
            conWrap.conPerCountry = conRecord.Narne_Permanent_Country__c;
            
            component.set("v.ContactWrapper",conWrap);
            
            component.find('preHNo').set('v.value',conRecord.Narne_Present_House_No__c);
            component.find('preStreet').set('v.value',conRecord.Narne_Present_Street__c);
            component.find('preLM').set('v.value',conRecord.Narne_Present_Landmark__c);
            component.find('preArea').set('v.value',conRecord.Narne_Present_Area__c);
            component.find('preCity').set('v.value',conRecord.Narne_Present_City__c);
            component.find('prePstate').set('v.value',conRecord.Narne_Current_State__c);
            component.find('prePcountry').set('v.value',conRecord.Narne_Current_Country__c);
            component.find('prePcode').set('v.value',conRecord.Narne_Present_Pincode__c);
            
            component.find('perHNo').set('v.value',conRecord.Narne_Permanent_House_No__c);
            component.find('perStreet').set('v.value',conRecord.Narne_Permanent_Street__c);
            component.find('perLM').set('v.value',conRecord.Narne_Permanent_Landmark__c);
            component.find('perArea').set('v.value',conRecord.Narne_Permanent_Area__c);
            component.find('perCity').set('v.value',conRecord.Narne_Permanent_City__c);
            component.find('perPstate').set('v.value',conRecord.Narne_Permanent_State__c);
            component.find('perPcountry').set('v.value',conRecord.Narne_Permanent_Country__c);
            component.find('perPcode').set('v.value',conRecord.Narne_Permanent_Pincode__c);         
        }catch(e){
            
        }
    },
    disableFields:function(component,event,helper){
        var val=event.getParam("checked");              
        if(val == true){
            component.set("v.hide" ,val);
        }
        if(val==false){
            component.set("v.hide" ,val);
            component.set("v.contactId",'');
            component.set("v.ContactWrapper.conSalutation",'');
            component.set("v.ContactWrapper.conFname",'');
            component.set("v.ContactWrapper.conMname",'');
            component.set("v.ContactWrapper.conLname",'');
            component.set("v.ContactWrapper.conGender",'');
            component.set("v.ContactWrapper.conDOB",'');
            component.set("v.ContactWrapper.conOccupation",'');
            component.set("v.ContactWrapper.conMobile1",'');
            component.set("v.ContactWrapper.conMobile2",'');
            component.set("v.ContactWrapper.conEmail1",'');
            component.set("v.ContactWrapper.conEmail2",''); 
        }        
    },
    dateUpdate: function(component, event, helper){
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        // if date is less then 10, then append 0 before date   
        if(dd < 10){
            dd = '0' + dd;
        } 
        // if month is less then 10, then append 0 before date    
        if(mm < 10){
            mm = '0' + mm;
        }
        var todayFormattedDate = yyyy+'-'+mm+'-'+dd;
        if(component.get("v.ContactWrapper.conDOB") != '' && component.get("v.ContactWrapper.conDOB") >= todayFormattedDate){
            component.set("v.dateValidationError" , true);
        }else{
            component.set("v.dateValidationError" , false);
        }
    },
    checkboxSelect: function(cmp, evt) {
        try{
            let val = evt.getSource().get('v.checked');
            if(val == true){
                let hNo = cmp.find("preHNo").get("v.value");
                cmp.find('perHNo').set('v.value',hNo);
                
                let cStreet = cmp.find("preStreet").get("v.value");
                cmp.find('perStreet').set('v.value',cStreet);
                
                let cLandmark = cmp.find("preLM").get("v.value");
                cmp.find('perLM').set('v.value',cLandmark);
                
                let cArea = cmp.find("preArea").get("v.value");
                cmp.find('perArea').set('v.value',cArea);
                
                let cCity = cmp.find("preCity").get("v.value");
                cmp.find('perCity').set('v.value',cCity);
                
                let cstate = cmp.find("prePstate").get("v.value");
                cmp.find('perPstate').set('v.value',cstate);
                
                let cCountry = cmp.find("prePcountry").get("v.value");
                cmp.find('perPcountry').set('v.value',cCountry);
                
                let cPincode = cmp.find("prePcode").get("v.value");
                cmp.find('perPcode').set('v.value',cPincode);
            }
            if(val==false){
                cmp.find('perHNo').set('v.value','');
                cmp.find('perStreet').set('v.value','');
                cmp.find('perLM').set('v.value','');
                cmp.find('perArea').set('v.value','');
                cmp.find('perCity').set('v.value','');
                cmp.find('perPstate').set('v.value','');
                cmp.find('perPcountry').set('v.value','');
                cmp.find('perPcode').set('v.value','');
            }
        }catch(e){
            
        }
    },
    inputChange:function(component, event) {
        let newValue =  event.getSource().get("v.name") ; 
    },
   handleOnSubmit : function(component, event, helper) {
        try{
            component.set("v.loaded",true);
            event.preventDefault();
            console.log("OnSubmit--->");
            var eventFields = event.getParam("fields");
            let projectId=component.get("v.projectId");
            let contactId=component.get("v.contactId");
            console.log("contactID",contactId)
            let memWrap=component.get("v.memberWrapper");
            let Mobile1=component.find("Mobile1").get("v.value");
            let Mobile2=component.find("Mobile2").get("v.value");
            let Mob1=Mobile1.length;
            console.log("Mob1--->",Mob1);
            let primarymemberId = component.get("v.primarymemberId");
            console.log("primary member Id-->",component.find("primarymemberLookupId").get("v.value"))
            console.log("primarymemId--->",component.get("v.primarymemberId"));
            console.log("primarymemberId--->",primarymemberId);
            console.log("primarymemDupId--->",component.get("v.primarymemDupId"));
            if(Mobile1.length!=10){
                component.set("v.loaded",false);
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Error!",
                    "message": "Please enter 10 digits valid Mobile 1.",
                    "type": "error"
                });
                toastEvent.fire();
            }
            else if ($A.util.isEmpty (projectId)) {
                component.set("v.loaded",false);
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Error!",
                    "message": "Please fill all the required fields",
                    "type": "error"
                });
                toastEvent.fire();
            }else if($A.util.isEmpty (projectId) == false && Mobile1.length == 10){
                eventFields["Name"] = memWrap.memNo;
                eventFields["Narne_Project_Name__c"] = projectId;
                eventFields["Narne_Existing_Contact__c"] = contactId;
                eventFields["Narne_Primary_Member__c"] = primarymemberId;
                component.find('newmemberCreateFrom').submit(eventFields);
            }
        }catch(e){
            console.log("ErrorOnSubmit--->",e);
            component.set("v.loaded",false);
        }
    },
    handleOnSuccess : function(component, event, helper) {
        try{
            //component.set("v.loaded",false);
            var param = event.getParams(); //get event params
            var fields = param.response.fields; //get all field info
            var recordId = param.response.id; //get record id
            var recordName = param.response.fields.Name.value;
            helper.saveNomineeList(component, event,helper,recordId);
            let filesData=component.get("v.uploadWrapper");
            var action = component.get("c.createAttachments");
            let docsData=component.get("v.identificationWrapper");
            action.setParams({
                recordId : recordId,
                filesData : JSON.stringify(filesData), 
                docsData : JSON.stringify(docsData)            
            });                 
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS"){
                    
                }else if (state === "ERROR") {
                    var errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            
                        }
                    } else {
                        
                    }
                }
            });
            $A.enqueueAction(action);
            component.set("v.isModalOpen",false);        
            var navLink = component.find("navService");
            var pageRef = {
                type: 'standard__recordPage',
                attributes: {
                    actionName: 'view',
                    objectApiName: 'Narne_New_Member__c',
                    recordId : recordId // change record id.  
                },
            };
            navLink.navigate(pageRef, true);
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "title": "Success!",
                "message": "New Member '" + recordName + "' was created",
                "type": "success"
            });
            toastEvent.fire(); 
        }catch(e){
            console.log("ErrorOnSuccess--->",e);
        }
    }, 
    navigateToComTwo : function(component, event, helper) {  
        var navLink = component.find("navService");
        var pageRef = {
            type: 'standard__recordPage',
            attributes: {
                actionName: 'view',
                objectApiName: 'Narne_New_Member__c',
                recordId : '0037FXXX51uq5QAA' // change record id. 
            },
        };
        navLink.navigate(pageRef, true);
    },
    handleOnCancel : function(component, event, helper) {
        component.set("v.isModalOpen",false);
        var navLink = component.find("navService");
        var pageRef = {
            type: 'standard__objectPage',
            attributes: {
                actionName: 'home',
                objectApiName: 'Narne_New_Member__c',
            },
        };
        navLink.navigate(pageRef, true);
    },
    handleOnError: function(component, event, helper){
        component.set("v.loaded",false);
        var message = '';
        var errors = event.getParams();
        console.log('Handleonerror',JSON.stringify(errors));
        var errormessages = errors.output;
        
        if ($A.util.isEmpty(errormessages.errors) === false) {
            if (errormessages.errors.length > 0) {
                for (var j = 0; errormessages.errors.length > j; j++) {
                    var fielderror = errormessages.errors[j];
                    if (fielderror.errorCode === 'DUPLICATES_DETECTED') {
                        message += 'Looks like this might be a duplicate. Click on the “Return to Search” button to find this contact';
                    }
                    else {
                        message += fielderror.errorCode + ' (' + fielderror.field + ') : ' + fielderror.message;
                    }
                }
            }
        }
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "type": "error",
            "title": "Error on Save!",
            "message": message
        });
        toastEvent.fire();
    },
    showSystemError: function(cmp, event) {
        console.log("HandleSystem Errors");
        cmp.set("v.loaded",false);
        // Handle system error
    },
    getProject: function(cmp, evt) {
        let projectId = evt.getParam("value");
        var action = cmp.get("c.getProjectRecord");
        action.setParams({ projectId : projectId });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                cmp.set("v.memberWrapper",response.getReturnValue());
                console.log("MemberWrapper",JSON.stringify(cmp.get("v.memberWrapper")));
            }
            else if (state === "INCOMPLETE") {
                // do something
            }
                else if (state === "ERROR") {
                    var errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            
                        }
                    } else {
                        
                    }
                }
        });
        $A.enqueueAction(action);
    },
    handleUploadFinished: function (cmp, event) {
        // Get the list of uploaded files
        var uploadedFiles = event.getParam("files");
        cmp.set("v.uploadWrapper",uploadedFiles);      
    },
    handleUpload: function (cmp, event) {
        // Get the list of uploaded files
        var uploadedIdentficationFiles = event.getParam("files");
        cmp.set("v.identificationWrapper",uploadedIdentficationFiles);
    },
    addRow: function(component, event, helper) {
        helper.addNomineeRecord(component, event);
    },
    removeRow: function(component, event, helper) {
        //Get the account list
        var nomineeList = component.get("v.nomineeList");
        //Get the target object
        var selectedItem = event.currentTarget;
        //Get the selected item index
        var index = selectedItem.dataset.record;
        nomineeList.splice(index, 1);
        component.set("v.nomineeList", nomineeList);
    }
})
