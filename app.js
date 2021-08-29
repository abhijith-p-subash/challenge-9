//Data Controller
var moneyControl = (() => {
    var income = function (id, description, amount) {
        this.id = id;
        this.description = description;
        this.amount = amount;
    }

    var expense = function (id, description, amount) {
        this.id = id;
        this.description = description;
        this.amount = amount;
        this.percentage = 0;
    }
    const data = {
        expense: [],
        income: [],
        percArr: [],
        totalIncome: 0,
        totalExpense: 0,
        budget: 0,
    }
    return {
        logData: () => {
            return data;
        },
        incIDgenerator: () => {
            const id = Math.floor(Math.random() * 1000);
            const incID = `income-${id}`
            console.log(incID);
            return data.id = incID;
        },
        expIDgenerator: () => {
            const id = Math.floor(Math.random() * 1000);
            const expID = `expense-${id}`
            console.log(expID);
            return data.id = expID;
        },

        addIncome: (description, amount) => {
            let ID = moneyControl.incIDgenerator();
            newIncome = new income(ID, description, amount);
            data.income.push(newIncome);
            console.log(newIncome);
            return newIncome;

        },
        addExpense: (description, amount) => {
            let ID = moneyControl.expIDgenerator();
            newExpense = new expense(ID, description, amount);
            data.expense.push(newExpense);
            console.log(newExpense);
            return newExpense;
        },
        budget: () => {
            const budget = moneyControl.totalIncome() - moneyControl.totalExpense();
            data.budget = budget;
            return budget;
        },
        totalIncome: () => {
            var totalInc = 0;
            data.income.map((obj) => {
                totalInc += parseInt(obj.amount);
            })
            data.totalIncome = totalInc;
            return totalInc;
        },
        totalExpense: () => {
            var totalExp = 0;
            data.expense.map((obj) => {
                totalExp += parseInt(obj.amount);
            })
            data.totalExpense = totalExp;
            return totalExp;
        },
        totalPercentage: () => {
            const totalPercentage = ((data.totalExpense / data.totalIncome) * 100).toFixed(1);
            return totalPercentage;
        },
        deleteIncome: (id) => {
            const findIDs = data.income.map((obj) => {
                return obj.id;
            });
            const index = findIDs.indexOf(id);
            data.income.splice(index, 1);
            console.log(data.income);
        },
        deleteExpense: (id) => {
            const findIDs = data.expense.map((obj) => {
                return obj.id;
            })
            const index = findIDs.indexOf(id);
            data.expense.splice(index, 1);
            console.log(data.expense);
        }
    }

})();

//UI Controller
var UIcontrol = (() => {
    var HTMLContent = {
        month: ".budget__title--month",
        budget: ".budget__value",
        income: ".budget__income--value",
        expense: ".budget__expenses--value",
        expensePercentage: ".budget__expenses--percentage",
        type: ".add__type",
        description: ".add__description",
        amount: ".add__value",
        addButton: ".add__btn",
        deleteButton: ".item__delete",
        incomeList: ".income__list",
        expenseList: ".expenses__list",
        itemClass: ".item",
        itemPercentage: ".item__percentage",
        itemValue: ".item__value"
    }
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    var date = new Date();
    document.querySelector(HTMLContent.month).innerHTML = monthNames[date.getMonth()] + " " + date.getFullYear();


    return {
        UIselector: () => {
            return HTMLContent;
        },
        getType: () => {
            return document.querySelector(HTMLContent.type).value
        },
        getDescription: () => {
            return document.querySelector(HTMLContent.description).value
        },
        getAmount: () => {
            return document.querySelector(HTMLContent.amount).value
        },
        clrInputs: () => {
            document.querySelector(HTMLContent.description).value = "";
            document.querySelector(HTMLContent.amount).value = "";
        },
        setBudgetUI: (budget) => {
            document.querySelector(HTMLContent.budget).innerHTML = budget;
        },
        incomeUIupdate: (income) => {
            document.querySelector(HTMLContent.income).innerHTML = `+ ${income}`;
        },
        expenseUIupdate: (expense, percentage) => {
            document.querySelector(HTMLContent.expense).innerHTML = `- ${expense}`;
            if (percentage.toLowerCase() === "infinity" || percentage.toLowerCase() === "nan") {
                document.querySelector(HTMLContent.expensePercentage).innerHTML = `- 1%`;
            } else {
                document.querySelector(HTMLContent.expensePercentage).innerHTML = `${percentage} %`;
            }
        },
        addUIincome: (income) => {
            const div = document.createElement("div");
            div.classList = "item clearfix";
            div.id = id = `${income.id}`;
            div.innerHTML = `<div class="item__description">${income.description}</div>
                             <div class="right clearfix">
                                <div class="item__value">${income.amount}</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>`

            document.querySelector(HTMLContent.incomeList).insertAdjacentElement("beforeend", div);
        },
        addUIexpense: (expense) => {
            const div = document.createElement("div");
            div.classList = "item clearfix";
            div.id = `${expense.id}`
            div.innerHTML = `<div class="item__description">${expense.description}</div>
                             <div class="right clearfix">
                                <div class="item__value">${expense.amount}</div>
                                <div class="item__percentage">0.0%</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>`
            document.querySelector(HTMLContent.expenseList).insertAdjacentElement("beforeend", div);
        },
        updatePercentage: () => {
            let children = [...document.querySelector(HTMLContent.expenseList).children];
            let data = moneyControl.logData();
            children.map((obj) => {
                let amount = obj.querySelector(HTMLContent.itemValue).textContent;
                let per = ((parseInt(amount) / data.totalIncome) * 100).toFixed(1);
                if(per.toLocaleLowerCase() === "infinity"){ per =  1}
                obj.querySelector(HTMLContent.itemPercentage).textContent = `- ${per} %`;
            })
        },
        deleteUIinc: (id) => {
            return document.getElementById(id).remove()
        },
        deleteUIexp: (id) => {
            return document.getElementById(id).remove()
        }
    }
})();



var system = (() => {

    var HTMLContent = UIcontrol.UIselector();
    var incomeItem = false;
    var expenseItem = false;

    //Event Listener
    var systemListener = () => {

        document.querySelector(HTMLContent.addButton).addEventListener("click", systemAdd);

        document.querySelector(HTMLContent.incomeList).addEventListener("click", systemIncDelete);

        document.querySelector(HTMLContent.expenseList).addEventListener("click", systemExpDelete);

    }

    //Add Income
    var systemAdd = () => {
        const type = UIcontrol.getType();
        const description = UIcontrol.getDescription();
        const amount = UIcontrol.getAmount();

        if (type === "inc") {
            if (description !== "" && amount !== "") {
                const INCOME = moneyControl.addIncome(description, amount);
                const TOTAL_INCOME = moneyControl.totalIncome();
                const BUDGET = moneyControl.budget();
                const TOTAL_EXPENSE = moneyControl.totalExpense();
                const TOTAL_EXPENSE_PER = moneyControl.totalPercentage();

                //UI Control
                UIcontrol.setBudgetUI(BUDGET);
                UIcontrol.incomeUIupdate(TOTAL_INCOME);
                UIcontrol.addUIincome(INCOME);
                UIcontrol.clrInputs();
                UIcontrol.setBudgetUI(BUDGET);
                UIcontrol.expenseUIupdate(TOTAL_EXPENSE, TOTAL_EXPENSE_PER);
                UIcontrol.updatePercentage();
                incomeItem = true;
            }
        } else {
            if (description !== "" && amount !== "") {
                const EXPENSE = moneyControl.addExpense(description, amount);
                const TOTAL_EXPENSE = moneyControl.totalExpense();
                const TOTAL_EXPENSE_PER = moneyControl.totalPercentage();
                const BUDGET = moneyControl.budget();

                //UI Control
                UIcontrol.expenseUIupdate(TOTAL_EXPENSE, TOTAL_EXPENSE_PER);
                UIcontrol.setBudgetUI(BUDGET);
                UIcontrol.addUIexpense(EXPENSE);
                UIcontrol.clrInputs();
                UIcontrol.updatePercentage();
                expenseItem = true;

            }
        }
    }

    //Delete Income
    var systemIncDelete = (event) => {
        //Delete Item
        const id = event.target.parentNode.parentNode.parentNode.parentNode.id;
        moneyControl.deleteIncome(id)
        UIcontrol.deleteUIinc(id);

        //Update Income
        const BUDGET = moneyControl.budget();
        const TOTAL_INCOME = moneyControl.totalIncome();
        UIcontrol.setBudgetUI(BUDGET);
        UIcontrol.incomeUIupdate(TOTAL_INCOME);

        //Update Expense
        const TOTAL_EXPENSE = moneyControl.totalExpense();
        const TOTAL_EXPENSE_PER = moneyControl.totalPercentage();
        UIcontrol.expenseUIupdate(TOTAL_EXPENSE, TOTAL_EXPENSE_PER);
        UIcontrol.updatePercentage();
    }

    //Delete Expense
    var systemExpDelete = (event) => {
        //Delete Itme
        const id = event.target.parentNode.parentNode.parentNode.parentNode.id;
        console.log(id);
        moneyControl.deleteExpense(id)
        UIcontrol.deleteUIexp(id);

        //Update Expense UI
        const BUDGET = moneyControl.budget();
        const TOTAL_EXPENSE = moneyControl.totalExpense();
        const TOTAL_EXPENSE_PER = moneyControl.totalPercentage();
        UIcontrol.setBudgetUI(BUDGET);
        UIcontrol.expenseUIupdate(TOTAL_EXPENSE, TOTAL_EXPENSE_PER);

        //Update Income UI
        const TOTAL_INCOME = moneyControl.totalIncome();
        console.log(BUDGET);
        UIcontrol.setBudgetUI(BUDGET);
        UIcontrol.incomeUIupdate(TOTAL_INCOME);
        UIcontrol.updatePercentage();
    }

    return {
        init: () => {
            systemListener();
            systemAdd();
            systemIncDelete();
            systemExpDelete();
        },
    };

})(moneyControl, UIcontrol);

system.init();










