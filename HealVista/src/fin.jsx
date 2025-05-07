import React, { useState } from 'react';
import { Download, Filter, Calendar } from 'lucide-react';
import './fin.css';

const Fin = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Sample financial data
  const revenueData = [
    { month: 'Jan', revenue: 3800, expenses: 2300 },
    { month: 'Feb', revenue: 2900, expenses: 1400 },
    { month: 'Mar', revenue: 9200, expenses: 2100 },
    { month: 'Apr', revenue: 3600, expenses: 4800 },
    { month: 'May', revenue: 1800, expenses: 4600 }
  ];
  
  const departmentExpenses = [
    { department: 'Emergency', amount: 12500 },
    { department: 'Surgery', amount: 18700 },
    { department: 'Cardiology', amount: 15600 },
    { department: 'Pediatrics', amount: 9800 },
    { department: 'Oncology', amount: 13200 }
  ];

  // New data for different tabs
  const revenueBreakdown = [
    { source: 'Insurance Claims', amount: 612500 },
    { source: 'Patient Payments', amount: 185700 },
    { source: 'Government Programs', amount: 115600 },
    { source: 'Grants', amount: 72620 }
  ];

  const expenseCategories = [
    { category: 'Staff Salaries', amount: 325400 },
    { category: 'Medical Supplies', amount: 156700 },
    { category: 'Equipment', amount: 82300 },
    { category: 'Utilities', amount: 41800 },
    { category: 'Administrative', amount: 117950 }
  ];

  const budgetPlanning = [
    { quarter: 'Q3 2025', projected: 1050000, allocated: 780000 },
    { quarter: 'Q4 2025', projected: 1120000, allocated: 830000 },
    { quarter: 'Q1 2026', projected: 980000, allocated: 750000 }
  ];
  
  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <div className="card summary-cards">
              <div className="summary-card">
                <h3>Total Revenue</h3>
                <p className="amount">$986,420</p>
                <p className="trend positive">+5.2% from last month</p>
              </div>
              <div className="summary-card">
                <h3>Total Expenses</h3>
                <p className="amount">$724,150</p>
                <p className="trend negative">+8.7% from last month</p>
              </div>
              <div className="summary-card">
                <h3>Net Income</h3>
                <p className="amount">$262,270</p>
                <p className="trend positive">+1.3% from last month</p>
              </div>
            </div>
            
            <div className="card chart-card">
              <h3>Revenue vs Expenses</h3>
              <div className="chart-container">
                {revenueData.map((item, index) => (
                  <div key={index} className="chart-column">
                    <div className="chart-bars">
                      <div 
                        className="revenue-bar" 
                        style={{ height: `${item.revenue / 100}px` }}
                        title={`Revenue: $${item.revenue * 1000}`}
                      ></div>
                      <div 
                        className="expense-bar" 
                        style={{ height: `${item.expenses / 100}px` }}
                        title={`Expenses: $${item.expenses * 1000}`}
                      ></div>
                    </div>
                    <div className="month-label">{item.month}</div>
                  </div>
                ))}
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <div className="legend-color revenue-color"></div>
                  <span>Revenue</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color expense-color"></div>
                  <span>Expenses</span>
                </div>
              </div>
            </div>
            
            <div className="lower-row">
              <div className="card department-expenses">
                <h3>Department Expenses</h3>
                <div className="expense-list">
                  {departmentExpenses.map((dept, index) => (
                    <div key={index} className="expense-item">
                      <div className="expense-info">
                        <div className="department-name">{dept.department}</div>
                        <div className="expense-amount">${dept.amount.toLocaleString()}</div>
                      </div>
                      <div className="expense-bar-container">
                        <div 
                          className="expense-progress"
                          style={{ width: `${(dept.amount / 20000) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="card billing-status">
                <h3>Billing Status</h3>
                <div className="status-chart">
                  <div className="donut-chart">
                    <div className="inner-circle">75%</div>
                  </div>
                </div>
                <div className="status-legend">
                  <div className="status-item">
                    <div className="status-color paid"></div>
                    <span>Paid (75%)</span>
                  </div>
                  <div className="status-item">
                    <div className="status-color pending"></div>
                    <span>Pending (15%)</span>
                  </div>
                  <div className="status-item">
                    <div className="status-color overdue"></div>
                    <span>Overdue (10%)</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case 'revenue':
        return (
          <div className="card">
            <h3>Revenue Breakdown</h3>
            <div className="chart-card">
              <div className="pie-chart-container">
                <div className="revenue-pie-chart"></div>
              </div>
              <div className="revenue-breakdown">
                {revenueBreakdown.map((item, index) => (
                  <div key={index} className="revenue-item">
                    <div className="revenue-info">
                      <div className="revenue-source">{item.source}</div>
                      <div className="revenue-amount">${item.amount.toLocaleString()}</div>
                    </div>
                    <div className="revenue-bar-container">
                      <div 
                        className="revenue-progress"
                        style={{ width: `${(item.amount / 650000) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="revenue-metrics">
              <div className="metric-card">
                <h4>Average Revenue Per Patient</h4>
                <p className="metric-value">$2,850</p>
                <p className="trend positive">+3.5% from last month</p>
              </div>
              <div className="metric-card">
                <h4>Revenue Growth Rate</h4>
                <p className="metric-value">5.2%</p>
                <p className="trend positive">+0.8% from last month</p>
              </div>
              <div className="metric-card">
                <h4>Monthly Target Completion</h4>
                <p className="metric-value">92%</p>
                <p className="trend positive">+7% from last month</p>
              </div>
            </div>
          </div>
        );
      case 'expenses':
        return (
          <div className="card">
            <h3>Expense Categories</h3>
            <div className="chart-card">
              <div className="expense-breakdown">
                {expenseCategories.map((item, index) => (
                  <div key={index} className="expense-item">
                    <div className="expense-info">
                      <div className="expense-category">{item.category}</div>
                      <div className="expense-amount">${item.amount.toLocaleString()}</div>
                    </div>
                    <div className="expense-bar-container">
                      <div 
                        className="expense-progress expense-color-bar"
                        style={{ width: `${(item.amount / 350000) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="expense-analytics">
              <div className="expense-card">
                <h4>Major Cost Drivers</h4>
                <div className="cost-driver-item">
                  <span>Staff Overtime</span>
                  <span className="trend negative">+12.5%</span>
                </div>
                <div className="cost-driver-item">
                  <span>Equipment Maintenance</span>
                  <span className="trend negative">+8.2%</span>
                </div>
                <div className="cost-driver-item">
                  <span>Medical Supplies</span>
                  <span className="trend negative">+5.9%</span>
                </div>
              </div>
              <div className="expense-card">
                <h4>Cost Reduction Opportunities</h4>
                <div className="cost-driver-item">
                  <span>Supply Chain Optimization</span>
                  <span className="trend positive">-7.2%</span>
                </div>
                <div className="cost-driver-item">
                  <span>Energy Efficiency</span>
                  <span className="trend positive">-4.5%</span>
                </div>
                <div className="cost-driver-item">
                  <span>Process Automation</span>
                  <span className="trend positive">-9.1%</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'budget':
        return (
          <div className="card">
            <h3>Budget Planning</h3>
            <div className="budget-timeline">
              {budgetPlanning.map((item, index) => (
                <div key={index} className="budget-quarter-card">
                  <h4>{item.quarter}</h4>
                  <div className="budget-metrics">
                    <div className="budget-metric">
                      <span className="budget-label">Projected Revenue</span>
                      <span className="budget-value">${item.projected.toLocaleString()}</span>
                    </div>
                    <div className="budget-metric">
                      <span className="budget-label">Allocated Budget</span>
                      <span className="budget-value">${item.allocated.toLocaleString()}</span>
                    </div>
                    <div className="budget-metric">
                      <span className="budget-label">Profit Margin</span>
                      <span className="budget-value">{Math.round((item.projected - item.allocated) / item.projected * 100)}%</span>
                    </div>
                  </div>
                  <div className="budget-bar-container">
                    <div className="budget-bar-label">Allocation</div>
                    <div className="budget-progress-container">
                      <div 
                        className="budget-progress"
                        style={{ width: `${(item.allocated / item.projected) * 100}%` }}
                      ></div>
                    </div>
                    <div className="budget-bar-value">{Math.round((item.allocated / item.projected) * 100)}%</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="budget-actions">
              <button className="budget-action-button">Adjust Q3 Budget</button>
              <button className="budget-action-button">Forecast 2026</button>
              <button className="budget-action-button">Department Allocation</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fin-container">
      <div className="fin-header">
        <h1>Financial Management</h1>
        <div className="header-actions">
          <button className="action-button">
            <Download size={16} />
            <span>Export</span>
          </button>
          <button className="action-button">
            <Filter size={16} />
            <span>Filter</span>
          </button>
          <button className="action-button">
            <Calendar size={16} />
            <span>May 2025</span>
          </button>
        </div>
      </div>
      
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'revenue' ? 'active' : ''}`}
          onClick={() => setActiveTab('revenue')}
        >
          Revenue
        </button>
        <button 
          className={`tab-button ${activeTab === 'expenses' ? 'active' : ''}`}
          onClick={() => setActiveTab('expenses')}
        >
          Expenses
        </button>
        <button 
          className={`tab-button ${activeTab === 'budget' ? 'active' : ''}`}
          onClick={() => setActiveTab('budget')}
        >
          Budget Planning
        </button>
      </div>
      
      <div className="finance-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Fin;