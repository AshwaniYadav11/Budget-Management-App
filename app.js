var budgetController= (function(){

var Expense=function(id,description,value){
    this.id=id;
    this.description=description;
    this.value=value;
    this.percentage=-1;

};




Expense.prototype.calcPercentage=function(totalIncome)
{
if(totalIncome>0)
{
this.percentage= Math.round((this.value/totalIncome)*100);
}
else
{
this.percentage=-1;
}

Expense.prototype.getPercentage=function()
{
return this.percentage;
}



}

var Income=function(id,description,value){
    this.id=id;
    this.description=description;
    this.value=value;
};


var calculateTotal=function(type){
var sum=0;

data.allItems[type].forEach(function(curr){
    sum+=curr.value;})


data.totals[type]=sum;
};

var data={
        allItems:{
                 inc:[],
                 exp:[]
		         },
        totals:{
        inc:0,
        exp:0
        },

        budget:0,
        percentage:-1

}
return{addItem : function(type,des,val)
{

var newItem, ID;
            
            //[1 2 3 4 5], next ID = 6
            //[1 2 4 6 8], next ID = 9
            // ID = last ID + 1
            
            // Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            console.log(ID);
            // Create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            console.log(newItem.id);
            // Push it into our data structure
            data.allItems[type].push(newItem);
            
            // Return the new element
            return newItem;


},

deleteItem:function(type,id)
{
var ids,index;

ids=data.allItems[type].map(function(curr)
{
return curr.id;
});
index=ids.indexOf(id);
if(index!==-1)
{data.allItems[type].splice(index,1);}

},

calculateBudget: function(){
calculateTotal('inc');
calculateTotal('exp');
//calculate totals

data.budget=data.totals.inc-data.totals.exp;//calculate budget income-expenses__list


if(data.totals.inc>0){data.percentage=(data.budget/data.totals.inc)*100;}//calculate percentage
else{data.percentage=-1;}
        

},

getBudget: function(){
return {budget:data.budget,
totalInc:data.totals.inc,
totalExp:data.totals.exp,
percentage:data.percentage}


},

calculatePercentage:function()
{


data.allItems.exp.forEach(function(curr){
curr.calcPercentage(data.totals.inc);
});
},

getPercentages:function()
{
var allPerc=data.allItems.exp.map(function(curr)
{
return curr.getPercentage();
});
return allPerc;
console.log(allPerc);
},


testing: function(){console.log(data);}};




})();





var UIcontroller=(function()//input object return
{
var DOMstring={
				inputType:'.add__type',
				inputValue:'.add__value',
				inputDescription:'.add__description',
				inputBtn:'.add__btn',
                incomeContainer:'.income__list',
                expenseContainer:'.expenses__list',
                budgetLabel:'.budget__value',               
               incomeLabel:'.budget__income--value',
                expenseLabel:'.budget__expenses--value',
                percentageLabel:'.budget__expenses--percentage',
               expensesPercLabel:'.item__percentage'
              }

 var formatNumber=function(num,type)
         {
         var numSplit,int,dec;
         // + or - depending upon the type

         //decimal zeros

         //appropriate commas
         num=Math.abs(num);
         num=num.toFixed(2);
         numSplit=num.split('.');

         int=numSplit[0];
         
         if(int.length>3)
         {
            int = int.substr(0,int.length-3) + "," + int.substr(int.length-3,3)  ; //123434

		 }
         dec=numSplit[1];

         return (type === 'exp'?'-':'+')+" " + int +"."+ dec;

         };
         var nodeListForEach=function(list,callback)
                              {
                              for(var i=0; i<list.length; i++)
                              {
                                     callback(list[i],i);                        
							  }
                              };


return{
	    getInput :function()
		{
		   return{
		           type:document.querySelector(DOMstring.inputType).value,
				   value:parseFloat(document.querySelector(DOMstring.inputValue).value),//value:document.querySelector('add__value').value,
				   description:document.querySelector(DOMstring.inputDescription).value
			    };
	    },

		getDOM: function()
		{
		return{DOMstring};
		},

        addItemlist: function(obj,typ)
                        {
                            var html,newHtml,element;
                            
                            
                            //add HTML string along with placeholder tag
 
                         if(typ==='inc'){element=DOMstring.incomeContainer; html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div>';}
                         else if(typ==='exp'){element=DOMstring.expenseContainer;    html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div></div> </div>';}
                           
                            //replace placeholder text with some actual data
                            
                            newHtml=html.replace('%id%',obj.id);
                            newHtml=newHtml.replace('%description%',obj.description);
                            newHtml=newHtml.replace('%value%',formatNumber(obj.value,typ));

                            //Insert HTML into DOM
                            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
						},
        deleteItemlist:function(selectID)
                        {
                            var elem=document.getElementById(selectID);
                            elem.parentNode.removeChild(elem);
                        
                        
                        
                        },

        displayMonth:function()
        {     var now,year,month;
              now=new Date();
              year=now.getFullYear();
              month=now.getMonth();
              var months=['January' ,'February' ,'March', 'April', 'May', 'June', 'July', 'August', 'September' ,'October', 'November', 'December'];
        document.querySelector(".budget__title--month").textContent=months[month]+" "+year;
        
        
        }  ,  

        changedType:function()
        {
        var fields=document.querySelectorAll(DOMstring.inputType+','+
                                          DOMstring.inputDescription+','+
                                          DOMstring.inputValue);

                 nodeListForEach(fields,function(curr)
                 {
                    curr.classList.toggle('red-focus');
                 })
        
        document.querySelector(DOMstring.inputBtn).classList.toggle('red');
        },





        clearField: function(){
                              var fields,fieldsArr;
                              fields=document.querySelectorAll(DOMstring.inputDescription + ', ' + DOMstring.inputValue);
                              fieldsArr=Array.prototype.slice.call(fields);
                              fieldsArr.forEach(function(curr,ind,arr){
                              curr.value='';
							 
                             });
                            
		fieldsArr[0].focus();
        },

         displayBudget:function(obj){
         var t=(obj.budget>0?'inc':'exp');
         document.querySelector(DOMstring.budgetLabel).textContent=formatNumber(obj.budget,t);
         document.querySelector(DOMstring.incomeLabel).textContent=formatNumber(obj.totalInc,'inc');
         document.querySelector(DOMstring.expenseLabel).textContent=formatNumber(obj.totalExp,'exp');
         if(obj.percentage>0)
         {document.querySelector(DOMstring.percentageLabel).textContent=Math.round(obj.percentage)+'%';}
         else{document.querySelector(DOMstring.percentageLabel).textContent='---';}
       

		 },


        

         displayPercentages:function(percentages)
         {
         var fields = document.querySelectorAll(DOMstring.expensesPercLabel);//this is a linked list so the for each method wont't work here.

         
            nodeListForEach(fields,function(curr,index)
            {
            curr.textContent=percentages[index]+'%';
            //if(percentages[index]>0){ curr.textContent=percentages[index]+'%';}
            //else{ curr.textContent='---';}
           
            
			});   







         
         
         }
        


     };
})();




var Controller= (function(budgetclt,UIclt)
{

var updateBudget= function()
{budgetclt.calculateBudget();//calc budgetclt
var budget=budgetclt.getBudget();//return budget
UIclt.displayBudget(budget);//display ui
}
    

   var ctlrAddItem = function() 
  {
   var input=UIclt.getInput();
   console.log(input);
   
   if(input.description!==''&&!isNaN(input.value) && input.value>0)
  { 
   var newItem = budgetclt.addItem(input.type,input.description,input.value);
  
  //console.log(newItem.id + " " + newItem.value);
  UIclt.addItemlist(newItem,input.type);
  UIclt.clearField();
  updateBudget();
  updatePercentage();
  }
  
  }

 var ctlrDeleteitem=function(event)
 {
 var itemID,ID,splitID,itemType;
 itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;
 console.log(itemID);
 if(itemID)
 {
 
 splitID=itemID.split('-');
 itemType=splitID[0];
 ID=parseInt(splitID[1]);
 console.log(ID);
 
 budgetclt.deleteItem(itemType,ID);//delete the id from structure
 

 UIclt.deleteItemlist(itemID)//delete from ui

 updatePercentage();
 }
 
 }

 var updatePercentage = function()
 {
budgetclt.calculatePercentage();//calculate percentage

var percentages= budgetclt.getPercentages();//read from budget controller
console.log(percentages);
//update percentage to ui
UIclt.displayPercentages(percentages);
 }
 
 var setupEventlistener= function()
 {
 var DOM = UIclt.getDOM();
 document.querySelector('.add__btn').addEventListener('click',ctlrAddItem);//dom string se anhi hua
 
 document.addEventListener('keypress',function(event) {
	
	if(event.keycode===13 || event.which===13)
	ctlrAddItem();//enter hit krne pr bhi same
    });

 document.querySelector(".container").addEventListener('click',ctlrDeleteitem);
 document.querySelector('.add__type'),addEventListener('change',UIclt.changedType);
 }
 
  
    return {
        init: function() {
            console.log('Application has started.');
            
            UIclt.displayMonth();
            UIclt.displayBudget({budget:0,
                                totalInc:0,
                                totalExp:0,
                                percentage:0});
            setupEventlistener();
        }
    };






})(budgetController,UIcontroller)

Controller.init();