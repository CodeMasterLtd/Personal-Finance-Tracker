const versionNumber = '1.0.0.0';

const list = document.getElementById('list');
let entries = JSON.parse(localStorage.getItem('entries')) || [];
const categories = ['Income', 'Groceries', 'Entertainment', 'Utilities'];

function addEntry() {
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;

    if (description && amount && category) {
        const entry = { id: Date.now(), description, amount, category };
        entries.push(entry);
        localStorage.setItem('entries', JSON.stringify(entries));
        displayEntries();
        updateChart();
    }
}

function deleteEntry(id) {
    entries = entries.filter(entry => entry.id !== id);
    localStorage.setItem('entries', JSON.stringify(entries));
    displayEntries();
    updateChart();
}

function displayEntries() {
    list.innerHTML = '';
    let totalExpenses = 0;
    let totalIncome = 0;

    entries.forEach(entry => {
        if (entry.category === 'Income') {
            totalIncome += entry.amount;
        } else {
            totalExpenses += entry.amount;
        }

        const item = document.createElement('div');
        item.className = 'entry';
        item.innerHTML = `${entry.description} (${entry.category}): £${entry.amount.toFixed(2)}
                          <button class="delete-button" onclick="deleteEntry(${entry.id})">Delete</button>`;
        list.appendChild(item);
    });

    if (entries.length === 0) {
        const noEntries = document.createElement('div');
        noEntries.display = 'none';
        list.appendChild(noEntries);
    } else {
        const totalExpensesItem = document.createElement('div');
        totalExpensesItem.className = 'entry';
        totalExpensesItem.textContent = `Total Expenses: £${totalExpenses.toFixed(2)}`;
        list.appendChild(totalExpensesItem);

        const totalIncomeItem = document.createElement('div');
        totalIncomeItem.className = 'entry';
        totalIncomeItem.textContent = `Total Income: £${totalIncome.toFixed(2)}`;
        list.appendChild(totalIncomeItem);

        const monthlySavings = totalIncome - totalExpenses;
        const savingsItem = document.createElement('div');
        savingsItem.className = 'entry';
        savingsItem.textContent = `Monthly Savings: £${monthlySavings.toFixed(2)}`;
        list.appendChild(savingsItem);
    }

    toggleChartVisibility();
}

function updateChart() {
    const ctx = document.getElementById('myChart').getContext('2d');
    const categorySums = categories.map(cat => {
        return entries
            .filter(entry => entry.category === cat)
            .reduce((sum, entry) => sum + entry.amount, 0);
    });

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                label: 'Expenses by Category',
                data: categorySums,
                backgroundColor: ['#4caf50', '#ff9800', '#f44336', '#2196f3'],
            }]
        }
    });

    toggleChartVisibility();
}

function toggleChartVisibility() {
    const chartContainer = document.querySelector('.chart-container');
    if (entries.length === 0) {
        chartContainer.style.display = 'none';
    } else {
        chartContainer.style.display = 'block';
    }
}


// Check theme preference from local storage
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.getElementById('theme-style').setAttribute('href', `styles-${savedTheme}.css`);
    document.getElementById('theme-toggle').textContent = savedTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    document.getElementById('theme-style').setAttribute('href', `styles-${currentTheme}.css`);
    document.getElementById('theme-toggle').textContent = currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
}

const version = document.getElementById('version');
if (version) {
    version.textContent = `V${versionNumber}`;
}

let chart;
displayEntries();
updateChart();
