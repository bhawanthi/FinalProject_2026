// Financial Chatbot Controller
const handleChatMessage = async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const lowerMessage = message.toLowerCase();
    let response = '';

    // Financial Advice
    if (lowerMessage.includes('save') || lowerMessage.includes('saving')) {
      response = "💰 **Saving Tips:**\n\n1. **50/30/20 Rule**: Allocate 50% for needs, 30% for wants, and 20% for savings\n2. **Automate Savings**: Set up automatic transfers to your savings account\n3. **Emergency Fund**: Aim to save 3-6 months of expenses\n4. **Cut Unnecessary Expenses**: Review subscriptions and recurring charges\n5. **Track Every Expense**: Use our transaction tracker to monitor spending";
    }
    else if (lowerMessage.includes('budget') || lowerMessage.includes('budgeting')) {
      response = "📊 **Budgeting Guide:**\n\n1. **Calculate Income**: Know your total monthly income\n2. **List Expenses**: Track fixed (rent, utilities) and variable (food, entertainment) costs\n3. **Set Limits**: Use our Budget feature to set category limits\n4. **Monitor Weekly**: Check your budget status regularly\n5. **Adjust as Needed**: Modify budgets based on actual spending patterns";
    }
    else if (lowerMessage.includes('salary') || lowerMessage.includes('income')) {
      response = "💵 **Salary Management:**\n\n1. **Pay Yourself First**: Save 20% of your salary immediately\n2. **Fixed Expenses**: Allocate 50-60% for essential bills\n3. **Discretionary Spending**: Keep 20-30% for personal expenses\n4. **Debt Payments**: Prioritize high-interest debts\n5. **Investment**: Consider investing 10-15% for long-term growth\n6. **Track in MONIVUE**: Add your salary as income in Transactions";
    }
    else if (lowerMessage.includes('invest') || lowerMessage.includes('investment')) {
      response = "📈 **Investment Basics:**\n\n1. **Start Early**: Time in the market beats timing the market\n2. **Diversify**: Don't put all eggs in one basket\n3. **Risk Assessment**: Match investments to your risk tolerance\n4. **Emergency Fund First**: Invest only after securing 3-6 months expenses\n5. **Long-term View**: Think 5+ years for growth investments\n6. **Research**: Understand what you're investing in";
    }
    else if (lowerMessage.includes('debt') || lowerMessage.includes('loan') || lowerMessage.includes('credit')) {
      response = "💳 **Debt Management:**\n\n1. **List All Debts**: Know what you owe and interest rates\n2. **Avalanche Method**: Pay high-interest debts first\n3. **Snowball Method**: Pay smallest debts first for motivation\n4. **Negotiate Rates**: Call creditors to request lower interest\n5. **Avoid New Debt**: Stop using credit cards while paying off debt\n6. **Track Progress**: Use our Goals feature to monitor debt reduction";
    }
    else if (lowerMessage.includes('goal') || lowerMessage.includes('financial goal')) {
      response = "🎯 **Setting Financial Goals:**\n\n1. **Be Specific**: Define clear, measurable goals\n2. **Set Timeline**: Give each goal a deadline\n3. **Break Down**: Divide large goals into smaller milestones\n4. **Track Progress**: Use MONIVUE's Goals feature\n5. **Examples**: Emergency fund, house down payment, vacation, retirement\n6. **Review Monthly**: Adjust goals based on progress";
    }
    else if (lowerMessage.includes('expense') || lowerMessage.includes('spending')) {
      response = "💸 **Managing Expenses:**\n\n1. **Categorize**: Use our Categories feature to organize spending\n2. **Identify Patterns**: Review Reports to see where money goes\n3. **Cut Waste**: Find and eliminate unnecessary expenses\n4. **Use Cash**: Try cash envelopes for discretionary spending\n5. **Wait 24 Hours**: For big purchases, wait before buying\n6. **Compare Prices**: Shop around for better deals";
    }
    else if (lowerMessage.includes('tax') || lowerMessage.includes('taxes')) {
      response = "📝 **Tax Management:**\n\n1. **Track Deductions**: Keep records of deductible expenses\n2. **Use Categories**: Tag tax-deductible transactions\n3. **Quarterly Estimates**: If self-employed, pay quarterly taxes\n4. **Maximize Deductions**: Contribute to retirement accounts\n5. **Keep Documents**: Save receipts and statements\n6. **Consult Professional**: For complex situations, hire a tax advisor";
    }

    // Error Help
    else if (lowerMessage.includes('error') || lowerMessage.includes('not working') || lowerMessage.includes('problem')) {
      response = "🔧 **Common Issues & Solutions:**\n\n**Login Issues:**\n- Clear browser cache and cookies\n- Check email and password are correct\n- Try password reset if needed\n\n**Transaction Not Saving:**\n- Check all required fields are filled\n- Ensure amount is a valid number\n- Verify date format is correct\n\n**Budget Not Updating:**\n- Refresh the page\n- Check transaction categories match budget categories\n- Ensure dates are within current period\n\n**Reports Not Loading:**\n- Select a valid date range\n- Ensure you have transactions in that period\n- Try refreshing the page\n\nIf issues persist, please contact support.";
    }
    else if (lowerMessage.includes('forgot password') || lowerMessage.includes('reset password')) {
      response = "🔐 **Password Reset:**\n\n1. Click 'Forgot Password' on login page\n2. Enter your registered email\n3. Check your inbox for reset link\n4. Click the link (valid for 1 hour)\n5. Enter new password\n6. Login with new credentials\n\nIf you don't receive email:\n- Check spam folder\n- Verify email address is correct\n- Wait a few minutes and try again";
    }
    else if (lowerMessage.includes('transaction') && lowerMessage.includes('delete')) {
      response = "🗑️ **Delete Transaction:**\n\n1. Go to Transactions page\n2. Find the transaction you want to delete\n3. Click the delete/trash icon\n4. Confirm deletion\n5. Budget and reports will update automatically\n\nNote: Deleted transactions cannot be recovered. Make sure before deleting!";
    }
    else if (lowerMessage.includes('category') && (lowerMessage.includes('add') || lowerMessage.includes('create'))) {
      response = "📁 **Add New Category:**\n\n1. Navigate to Categories section\n2. Click 'Add Category' or '+' button\n3. Enter category name (e.g., 'Groceries', 'Entertainment')\n4. Choose category type (Income/Expense)\n5. Select an icon (optional)\n6. Save the category\n\nYou can now use this category when adding transactions!";
    }

    // Main System Functions - Step by Step
    else if (lowerMessage.includes('how') && lowerMessage.includes('add transaction')) {
      response = "➕ **How to Add Transaction (Step-by-Step):**\n\n**Method 1 - From Dashboard:**\n1. Login to your MONIVUE account\n2. On Home page, find 'Quick Add' section\n3. Click '+ Add Transaction' button\n\n**Method 2 - From Transactions Page:**\n1. Click 'Transactions' in top navigation menu\n2. Click 'Add New Transaction' button (top right)\n\n**Fill Transaction Form:**\n3. **Description**: What you bought (e.g., 'Grocery Shopping')\n4. **Amount**: Enter number (e.g., 150.50)\n5. **Category**: Select from dropdown:\n   - Food, Transport, Bills, Entertainment, etc.\n6. **Date**: Pick transaction date from calendar\n7. **Type**: Choose 'Income' or 'Expense'\n8. **Notes** (Optional): Add extra details\n\n**Save & View:**\n9. Click 'Save Transaction' button\n10. See it appear in your transaction list\n11. Dashboard updates automatically\n12. Budget adjusts if category has budget\n\n✅ Done! Transaction is recorded.";
    }
    else if (lowerMessage.includes('edit') && lowerMessage.includes('transaction')) {
      response = "✏️ **How to Edit Transaction:**\n\n**Access Transaction:**\n1. Go to 'Transactions' page\n2. Find the transaction you want to edit\n3. You'll see transaction list with all details\n\n**Edit Steps:**\n4. Click the 'Edit' icon (pencil/pen icon) on that transaction\n5. Transaction form opens with current data\n6. Modify any field:\n   - Change description\n   - Update amount\n   - Select different category\n   - Adjust date\n   - Change type (Income/Expense)\n7. Click 'Update' or 'Save Changes'\n\n**Results:**\n✅ Transaction updated immediately\n✅ Dashboard recalculates totals\n✅ Budget adjusts automatically\n✅ Reports reflect changes\n\n**Note:** Changes are permanent but you can edit again anytime!";
    }
    else if (lowerMessage.includes('delete') && lowerMessage.includes('transaction')) {
      response = "🗑️ **How to Delete Transaction:**\n\n**Access & Delete:**\n1. Navigate to 'Transactions' page\n2. Locate the transaction to delete\n3. Click the 'Delete' icon (trash bin icon)\n4. Confirmation popup appears\n5. Click 'Confirm' or 'Yes, Delete'\n\n**What Happens:**\n✅ Transaction removed immediately\n✅ Amount deducted from totals\n✅ Budget recalculates\n✅ Dashboard updates\n✅ Reports adjust\n\n⚠️ **Warning:**\n- Deletion is PERMANENT\n- Cannot be undone\n- Make sure before deleting\n\n**Alternative:**\nIf unsure, EDIT the transaction instead of deleting it!";
    }
    else if (lowerMessage.includes('how') && lowerMessage.includes('set budget')) {
      response = "💰 **How to Set Budget (Complete Guide):**\n\n**Access Budget Section:**\n1. Login to MONIVUE\n2. Click 'Budgets' in top navigation\n3. You'll see budget dashboard\n\n**Create New Budget:**\n4. Click 'Create Budget' or '+ Add Budget' button\n5. Budget form appears\n\n**Fill Budget Details:**\n6. **Category**: Select category to budget\n   - Food, Transport, Entertainment, etc.\n7. **Amount**: Enter monthly limit (e.g., 500)\n8. **Period**: Usually monthly (default)\n9. **Start Date**: When budget begins\n10. **End Date**: When budget ends (optional)\n\n**Save & Monitor:**\n11. Click 'Save Budget'\n12. Budget appears in your budget list\n13. See budget card showing:\n    - Category name\n    - Budget limit\n    - Amount spent\n    - Amount remaining\n    - Progress bar (visual indicator)\n\n**Track in Real-Time:**\n✅ As you add transactions, budget updates\n✅ Progress bar fills up\n✅ Get alerts at 80% spent\n✅ Warning when exceeded\n\n**Pro Tip:** Set budgets for ALL major spending categories!";
    }
    else if (lowerMessage.includes('update') && lowerMessage.includes('budget')) {
      response = "📝 **How to Update/Edit Budget:**\n\n**Access Budget:**\n1. Go to 'Budgets' page\n2. Find the budget you want to modify\n3. You'll see all your active budgets\n\n**Edit Budget:**\n4. Click 'Edit' icon on the budget card\n5. Budget form opens with current values\n6. Modify:\n   - Increase/decrease amount\n   - Change time period\n   - Adjust dates\n   - Switch category (if needed)\n7. Click 'Update Budget'\n\n**Results:**\n✅ Budget limit updated\n✅ Progress recalculates\n✅ New percentage shown\n✅ Alerts adjust to new limit\n\n**When to Update:**\n- Income changes\n- Expenses increase\n- New financial goals\n- Seasonal changes\n\n**Best Practice:** Review and adjust budgets monthly!";
    }
    else if (lowerMessage.includes('how') && lowerMessage.includes('report')) {
      response = "📊 **How to View & Use Reports:**\n\n**Access Reports:**\n1. Click 'Reports' in navigation menu\n2. Reports dashboard loads\n\n**Select Time Period:**\n3. Choose date range:\n   - This Week\n   - This Month\n   - This Year\n   - Custom Range (select start/end dates)\n4. Click 'Apply' or 'Generate Report'\n\n**View Visualizations:**\n\n**Chart 1: Spending by Category**\n- Pie chart showing category breakdown\n- See which category costs most\n- Hover for exact amounts\n\n**Chart 2: Income vs Expenses**\n- Bar chart comparison\n- See if spending more than earning\n- Monthly trends\n\n**Chart 3: Trend Analysis**\n- Line chart over time\n- Track spending patterns\n- Identify peaks/valleys\n\n**Summary Statistics:**\n- Total Income\n- Total Expenses\n- Net Balance (Income - Expenses)\n- Savings Rate\n- Top spending categories\n\n**Export Report:**\n5. Click 'Export' or 'Download'\n6. Choose format (PDF/CSV)\n7. Save to your device\n\n**Use Insights:**\n✅ Find areas to cut costs\n✅ Adjust budgets accordingly\n✅ Set better financial goals\n✅ Track progress over time";
    }
    else if (lowerMessage.includes('how') && lowerMessage.includes('goal')) {
      response = "🎯 **How to Create & Track Goals:**\n\n**Access Goals Section:**\n1. Login to MONIVUE\n2. Click 'Goals' in navigation\n3. Goals page opens\n\n**Create New Goal:**\n4. Click '+ Add Goal' or 'Create Goal'\n5. Goal form appears\n\n**Fill Goal Details:**\n6. **Goal Name**: What you're saving for\n   - Examples: 'Emergency Fund', 'Vacation', 'New Car'\n7. **Target Amount**: How much you need (e.g., 5000)\n8. **Current Amount**: What you've saved already (e.g., 0)\n9. **Deadline**: Target date to achieve goal\n10. **Priority**: High/Medium/Low (optional)\n11. **Description**: Why this goal matters (optional)\n\n**Save Goal:**\n12. Click 'Save Goal'\n13. Goal card appears showing:\n    - Goal name\n    - Progress bar\n    - Amount saved / Target amount\n    - Percentage complete\n    - Days remaining\n\n**Update Progress:**\n14. As you save money, click 'Update Progress'\n15. Enter new current amount\n16. Watch progress bar grow!\n\n**Track Multiple Goals:**\n✅ Create unlimited goals\n✅ See all at once\n✅ Prioritize what matters\n✅ Celebrate milestones\n\n**Goal Tips:**\n- Link to specific budget category\n- Set realistic deadlines\n- Update weekly/monthly\n- Review and adjust as needed";
    }
    else if (lowerMessage.includes('how') && lowerMessage.includes('category')) {
      response = "📁 **How to Manage Categories:**\n\n**View Categories:**\n1. Go to 'Categories' section (or Settings)\n2. See list of all categories\n3. Default + Custom categories shown\n\n**Add New Category:**\n4. Click '+ Add Category' button\n5. Category form opens\n6. Enter:\n   - **Name**: Category name (e.g., 'Gym Membership')\n   - **Type**: Income or Expense\n   - **Icon**: Choose icon (optional)\n   - **Color**: Select color (optional)\n7. Click 'Save Category'\n\n**Edit Category:**\n8. Find category in list\n9. Click 'Edit' icon\n10. Modify name, type, or appearance\n11. Save changes\n\n**Delete Category:**\n12. Click 'Delete' icon on category\n13. Confirm deletion\n14. ⚠️ Warning: Affects related transactions\n\n**Use Categories:**\n✅ Select when adding transactions\n✅ Set budgets per category\n✅ View spending reports by category\n✅ Organize finances better\n\n**Recommended Categories:**\n- Housing, Food, Transport, Utilities\n- Healthcare, Entertainment, Shopping\n- Debt Payments, Savings, Investments";
    }
    else if (lowerMessage.includes('register') || lowerMessage.includes('sign up') || lowerMessage.includes('create account')) {
      response = "👤 **How to Register/Create Account:**\n\n**Access Registration:**\n1. Go to MONIVUE website\n2. Click 'Register' or 'Sign Up' button\n3. Registration form appears\n\n**Fill Registration Form:**\n4. **Full Name**: Enter your name\n5. **Email Address**: Valid email for login\n6. **Password**: Strong password (8+ characters)\n   - Include uppercase, lowercase, number\n7. **Confirm Password**: Re-enter password\n8. Accept Terms & Conditions (checkbox)\n\n**Complete Registration:**\n9. Click 'Register' or 'Create Account'\n10. Account created successfully!\n11. Automatically logged in\n12. Redirected to dashboard\n\n**First Steps After Registration:**\n✅ Complete profile (optional)\n✅ Add first transaction\n✅ Set up budgets\n✅ Create financial goals\n✅ Explore features\n\n**Email Verification:**\n- Check inbox for welcome email\n- Verify email if required\n- Keep credentials secure\n\n**Tip:** Use strong, unique password!";
    }
    else if (lowerMessage.includes('login') || (lowerMessage.includes('how') && lowerMessage.includes('access'))) {
      response = "🔐 **How to Login to Your Account:**\n\n**Access Login Page:**\n1. Go to MONIVUE website\n2. Click 'Login' button\n3. Login form appears\n\n**Enter Credentials:**\n4. **Email**: Your registered email\n5. **Password**: Your account password\n6. (Optional) Check 'Remember Me' for easier future access\n\n**Login:**\n7. Click 'Login' or 'Sign In' button\n8. System verifies credentials\n9. Successfully logged in!\n10. Redirected to Dashboard\n\n**After Login:**\n✅ See your financial overview\n✅ Access all features\n✅ View recent transactions\n✅ Check budget status\n✅ Monitor goals\n\n**Trouble Logging In?**\n- Verify email is correct\n- Check password (case-sensitive)\n- Clear browser cache\n- Try 'Forgot Password' if needed\n\n**Security Tips:**\n- Don't share password\n- Logout on shared devices\n- Use strong passwords\n- Enable 2FA if available";
    }
    else if (lowerMessage.includes('logout') || lowerMessage.includes('log out') || lowerMessage.includes('sign out')) {
      response = "🚪 **How to Logout Safely:**\n\n**Logout Steps:**\n1. Look for user profile icon (top right)\n2. Click on your name/profile picture\n3. Dropdown menu appears\n4. Click 'Logout' or 'Sign Out'\n5. Confirm if prompted\n\n**What Happens:**\n✅ Session ends immediately\n✅ Redirected to login page\n✅ Data remains secure\n✅ Need to login again for access\n\n**When to Logout:**\n- Using shared computer\n- Public device\n- End of session\n- Security precaution\n\n**Alternative (Quick):**\nSome browsers: Close tab/window on private devices\n\n**Remember:**\n- Always logout on public computers\n- Don't save password on shared devices\n- Your data stays secure on our servers";
    }
    else if (lowerMessage.includes('profile') || lowerMessage.includes('account settings')) {
      response = "⚙️ **How to Access Profile/Settings:**\n\n**Access Settings:**\n1. Login to your account\n2. Click profile icon (top right corner)\n3. Select 'Profile' or 'Settings'\n4. Settings page opens\n\n**Profile Information:**\n5. View/Edit:\n   - Name\n   - Email address\n   - Profile picture (if available)\n   - Contact information\n6. Click 'Save Changes' after editing\n\n**Account Settings:**\n- **Password Change**: Update password for security\n- **Notifications**: Enable/disable alerts\n- **Privacy**: Control data visibility\n- **Currency**: Set preferred currency\n- **Date Format**: Choose format preference\n\n**Preferences:**\n- Theme (Light/Dark mode if available)\n- Default view settings\n- Report preferences\n- Budget periods\n\n**Account Actions:**\n- Export all data\n- Delete account (careful!)\n- View activity log\n\n**Save Changes:**\n7. Always click 'Save' or 'Update'\n8. Changes apply immediately";
    }
    else if (lowerMessage.includes('dashboard') || lowerMessage.includes('overview')) {
      response = "🏠 **How to Use Dashboard:**\n\n**Access Dashboard:**\n1. Login to MONIVUE\n2. Automatically land on Dashboard (Home page)\n3. Or click 'Home' in navigation\n\n**Dashboard Sections:**\n\n**📊 Summary Cards (Top):**\n- **Total Income**: Money earned this month\n- **Total Expenses**: Money spent this month  \n- **Net Balance**: Income minus expenses\n- **Savings Rate**: Percentage saved\n\n**💰 Budget Overview:**\n- See all active budgets\n- Progress bars for each category\n- Color indicators:\n  - 🟢 Green: Under budget\n  - 🟡 Yellow: Near limit (80%)\n  - 🔴 Red: Over budget\n\n**🎯 Goals Progress:**\n- Quick view of goals\n- Percentage completed\n- Days remaining to deadline\n\n**💸 Recent Transactions:**\n- Last 5-10 transactions\n- Quick overview of spending\n- Click to view details\n\n**📈 Charts & Graphs:**\n- Spending trends\n- Category breakdown\n- Income vs Expense comparison\n\n**How to Use:**\n✅ Check daily for overview\n✅ Click cards for detailed view\n✅ Quick add transactions\n✅ Monitor budget health\n✅ Track goal progress\n\n**Pro Tip:** Dashboard refreshes automatically when you add/edit data!";
    }

    // Financial Terms & Concepts
    else if (lowerMessage.includes('inflation') || lowerMessage.includes('what is inflation')) {
      response = "📊 **Understanding Inflation:**\n\nInflation is the rate at which prices for goods and services increase over time.\n\n**Impact on Your Money:**\n- Reduces purchasing power\n- $100 today buys less in future\n- Average: 2-3% annually\n\n**Protect Against Inflation:**\n1. Invest in stocks/real estate\n2. Keep emergency fund in high-yield savings\n3. Increase income regularly\n4. Review and adjust budget yearly\n5. Don't keep all money in cash";
    }
    else if (lowerMessage.includes('compound interest') || lowerMessage.includes('compounding')) {
      response = "💎 **Compound Interest - The 8th Wonder:**\n\n**What is it?**\nEarning interest on your interest - money grows exponentially!\n\n**Example:**\n- Save $1000 at 7% annual return\n- Year 1: $1,070\n- Year 10: $1,967\n- Year 30: $7,612\n\n**Key Principles:**\n1. **Start Early**: Time is your biggest advantage\n2. **Stay Consistent**: Regular contributions matter\n3. **Reinvest Earnings**: Don't withdraw gains\n4. **Be Patient**: Let it grow long-term\n\nTrack your savings goals in MONIVUE!";
    }
    else if (lowerMessage.includes('credit score') || lowerMessage.includes('credit rating')) {
      response = "🏆 **Credit Score Guide:**\n\n**What affects it?**\n1. Payment history (35%)\n2. Credit utilization (30%)\n3. Credit history length (15%)\n4. Credit mix (10%)\n5. New credit (10%)\n\n**Improve Your Score:**\n- Pay all bills on time\n- Keep credit card usage under 30%\n- Don't close old accounts\n- Limit new credit applications\n- Check reports for errors\n\n**Score Ranges:**\n- 800-850: Excellent\n- 740-799: Very Good\n- 670-739: Good\n- 580-669: Fair\n- 300-579: Poor";
    }
    else if (lowerMessage.includes('retirement') || lowerMessage.includes('retire')) {
      response = "👴 **Retirement Planning:**\n\n**Rule of Thumb:**\nNeed 25x your annual expenses saved\n\n**Steps to Prepare:**\n1. Start saving early (20s/30s)\n2. Contribute to retirement accounts\n3. Aim to save 15-20% of income\n4. Diversify investments\n5. Plan for healthcare costs\n6. Consider inflation\n\n**Retirement Accounts:**\n- 401(k) - Employer sponsored\n- IRA - Individual account\n- Roth IRA - Tax-free growth\n\nUse MONIVUE Goals to track retirement savings!";
    }
    else if (lowerMessage.includes('insurance') || lowerMessage.includes('coverage')) {
      response = "🛡️ **Essential Insurance Types:**\n\n**1. Health Insurance**\n- Covers medical expenses\n- Priority #1 for everyone\n\n**2. Life Insurance**\n- If others depend on your income\n- Term life is most affordable\n\n**3. Disability Insurance**\n- Replaces income if you can't work\n- Often overlooked but critical\n\n**4. Auto Insurance**\n- Required by law in most places\n\n**5. Homeowner's/Renter's**\n- Protects property and belongings\n\n**Tips:**\n- Shop around for best rates\n- Review coverage annually\n- Don't over or under insure";
    }
    else if (lowerMessage.includes('diversification') || lowerMessage.includes('diversify')) {
      response = "🎯 **Diversification Strategy:**\n\n**\"Don't put all eggs in one basket\"**\n\n**Why Diversify?**\n- Reduces risk\n- Smooths returns\n- Protects wealth\n\n**How to Diversify:**\n1. **Asset Classes**: Stocks, bonds, real estate, cash\n2. **Geography**: Domestic + international\n3. **Industries**: Tech, healthcare, finance, etc.\n4. **Company Size**: Large, mid, small cap\n\n**Simple Portfolio Example:**\n- 60% Stocks (various industries)\n- 30% Bonds (stability)\n- 10% Cash/Alternatives\n\nAdjust based on age and risk tolerance!";
    }
    else if (lowerMessage.includes('emergency fund') || lowerMessage.includes('emergency savings')) {
      response = "🚨 **Emergency Fund Essentials:**\n\n**What is it?**\nMoney saved for unexpected expenses:\n- Job loss\n- Medical emergencies\n- Car/home repairs\n- Urgent travel\n\n**How Much?**\n- Minimum: $1,000\n- Goal: 3-6 months of expenses\n- Self-employed: 6-12 months\n\n**Where to Keep It:**\n- High-yield savings account\n- Easily accessible\n- NOT in investments\n\n**Building Steps:**\n1. Start with $500-1,000\n2. Save $50-100 per paycheck\n3. Put bonuses/tax refunds here\n4. Automate transfers\n\nTrack progress with MONIVUE Goals!";
    }
    else if (lowerMessage.includes('stock') || lowerMessage.includes('shares')) {
      response = "📈 **Stocks/Shares Basics:**\n\n**What are stocks?**\nOwnership shares in a company\n\n**Two Ways to Profit:**\n1. **Capital Gains**: Share price increases\n2. **Dividends**: Company pays shareholders\n\n**Risk Levels:**\n- Individual stocks: High risk\n- Index funds: Lower risk (diversified)\n- ETFs: Moderate risk\n\n**Getting Started:**\n1. Open brokerage account\n2. Start with index funds\n3. Invest regularly (dollar-cost averaging)\n4. Think long-term (5+ years)\n5. Don't panic sell\n\n**Remember:**\n- Past performance ≠ future results\n- Only invest what you can afford to lose\n- Diversify!";
    }
    else if (lowerMessage.includes('cryptocurrency') || lowerMessage.includes('crypto') || lowerMessage.includes('bitcoin')) {
      response = "₿ **Cryptocurrency Basics:**\n\n**What is Crypto?**\nDigital currency using blockchain technology\n\n**Popular Ones:**\n- Bitcoin (BTC)\n- Ethereum (ETH)\n- Others: Thousands exist\n\n**⚠️ Important Notes:**\n- EXTREMELY volatile\n- Can lose 50%+ in days\n- Not FDIC insured\n- Regulatory uncertainty\n\n**If You Invest:**\n1. Only 5-10% of portfolio MAX\n2. Money you can afford to lose\n3. Use reputable exchanges\n4. Secure your wallet\n5. Don't invest based on hype\n\n**Recommendation:**\nBuild traditional portfolio first before crypto!";
    }
    else if (lowerMessage.includes('side hustle') || lowerMessage.includes('extra income')) {
      response = "💼 **Side Hustle Ideas:**\n\n**Online Opportunities:**\n- Freelance writing/design\n- Virtual assistant\n- Online tutoring\n- Social media management\n- Content creation\n- E-commerce/dropshipping\n\n**Local Options:**\n- Food delivery\n- Rideshare driving\n- Pet sitting/dog walking\n- Handyman services\n- Photography\n- Consulting in your field\n\n**Getting Started:**\n1. Identify your skills\n2. Start small (weekends)\n3. Set income goals\n4. Track expenses separately\n5. Save 25-30% for taxes\n\nTrack side income in MONIVUE Transactions!";
    }
    
    // Website Features & How It Works
    else if (lowerMessage.includes('how does monivue work') || lowerMessage.includes('how website work')) {
      response = "🌟 **How MONIVUE Works:**\n\n**Overview:**\nMONIVUE is your complete personal finance management platform\n\n**Core Features:**\n\n1️⃣ **Transactions**\n- Record income & expenses\n- Categorize spending\n- Track daily cash flow\n\n2️⃣ **Budgets**\n- Set monthly spending limits\n- Monitor categories\n- Get overspending alerts\n\n3️⃣ **Goals**\n- Create savings targets\n- Track progress\n- Stay motivated\n\n4️⃣ **Reports**\n- Visual charts & graphs\n- Spending analysis\n- Income vs expenses\n\n5️⃣ **AI Assistant** (Me!)\n- 24/7 financial advice\n- Feature help\n- Problem solving\n\n**Get Started:** Add your first transaction!";
    }
    else if (lowerMessage.includes('what is monivue') || lowerMessage.includes('about monivue')) {
      response = "💎 **About MONIVUE:**\n\n**Mission:**\n\"Track. Save. Grow.\" - Your Financial Journey Starts Here\n\n**What We Do:**\nMONIVUE helps you take control of your finances through:\n- Smart expense tracking\n- Budget management\n- Goal setting\n- Financial insights\n- AI-powered assistance\n\n**Why MONIVUE?**\n✅ Easy to use interface\n✅ Complete financial overview\n✅ Real-time budget tracking\n✅ Personalized recommendations\n✅ 24/7 AI support (that's me!)\n✅ Secure & private\n\n**Who It's For:**\n- Anyone wanting to save money\n- People managing budgets\n- Goal-oriented savers\n- Financial beginners\n\nStart your journey today!";
    }
    else if (lowerMessage.includes('navigation') || lowerMessage.includes('navigate') || lowerMessage.includes('menu')) {
      response = "🧭 **Navigating MONIVUE:**\n\n**Main Menu Sections:**\n\n📊 **Home**\n- Dashboard overview\n- Quick stats\n- Recent activity\n\n💸 **Transactions**\n- Add income/expenses\n- View transaction history\n- Edit or delete entries\n\n💰 **Budgets**\n- Create category budgets\n- Monitor spending limits\n- See budget status\n\n🎯 **Goals**\n- Set financial targets\n- Track savings progress\n- Update goal amounts\n\n📈 **Reports**\n- Visual analytics\n- Spending trends\n- Category breakdowns\n\n**Quick Tip:**\nUse the top navigation bar to switch between sections easily!";
    }
    else if (lowerMessage.includes('dashboard') || lowerMessage.includes('home page')) {
      response = "🏠 **Dashboard Overview:**\n\n**What You'll See:**\n\n📊 **Summary Cards**\n- Total Income (this month)\n- Total Expenses (this month)\n- Net Balance\n- Budget Status\n\n📈 **Quick Stats**\n- Recent transactions\n- Budget progress bars\n- Goal completion percentage\n- Spending by category\n\n🔔 **Notifications**\n- Budget warnings\n- Goal milestones\n- Upcoming bills (if set)\n\n**How to Use:**\n1. Check dashboard daily\n2. Review spending patterns\n3. Monitor budget health\n4. Stay on track with goals\n\n**Pro Tip:**\nDashboard updates in real-time as you add transactions!";
    }
    else if (lowerMessage.includes('categories') || lowerMessage.includes('category list')) {
      response = "📁 **Transaction Categories:**\n\n**Default Categories:**\n\n💰 **Income:**\n- Salary\n- Freelance\n- Investment returns\n- Other income\n\n💸 **Expenses:**\n- 🏠 Housing (rent, mortgage)\n- 🍔 Food (groceries, dining)\n- 🚗 Transportation\n- 💡 Utilities\n- 🏥 Healthcare\n- 🎬 Entertainment\n- 👕 Shopping\n- 📚 Education\n- 💳 Debt payments\n- 🎯 Savings\n\n**Custom Categories:**\nYou can create your own categories!\n\n**Why Categorize?**\n- See where money goes\n- Set targeted budgets\n- Identify savings opportunities\n- Better financial reports";
    }
    else if (lowerMessage.includes('data') && (lowerMessage.includes('safe') || lowerMessage.includes('secure') || lowerMessage.includes('privacy'))) {
      response = "🔒 **Data Security & Privacy:**\n\n**Your Data is Protected:**\n\n🛡️ **Security Measures:**\n- Encrypted connections (HTTPS)\n- Secure password storage\n- Session-based authentication\n- Regular security updates\n\n🔐 **Privacy:**\n- Your data is yours\n- No selling to third parties\n- No ads based on your finances\n- You control your information\n\n**Best Practices:**\n1. Use strong, unique password\n2. Don't share login credentials\n3. Log out on shared devices\n4. Review account regularly\n5. Enable notifications\n\n**Account Control:**\n- Export your data anytime\n- Delete account if needed\n\nYour financial privacy matters to us!";
    }
    else if (lowerMessage.includes('export') || lowerMessage.includes('download data')) {
      response = "📥 **Export Your Data:**\n\n**Available Exports:**\n\n📊 **Reports**\n- Download as PDF\n- Include charts & graphs\n- Custom date ranges\n\n💾 **Transaction History**\n- CSV format\n- Import to Excel/Sheets\n- Filter by date/category\n\n📈 **Budget Reports**\n- Monthly summaries\n- Category breakdowns\n- Progress tracking\n\n**How to Export:**\n1. Go to Reports section\n2. Select date range\n3. Click 'Export' or 'Download'\n4. Choose format (PDF/CSV)\n5. Save to your device\n\n**Use Cases:**\n- Tax preparation\n- Financial planning\n- Backup records\n- Share with advisor";
    }
    else if (lowerMessage.includes('mobile') || lowerMessage.includes('phone') || lowerMessage.includes('responsive')) {
      response = "📱 **Mobile Experience:**\n\n**Responsive Design:**\nMONIVUE works perfectly on:\n- 📱 Smartphones (iOS/Android)\n- 📟 Tablets\n- 💻 Desktop computers\n- 🖥️ All screen sizes\n\n**Mobile Features:**\n✅ Full functionality\n✅ Touch-optimized interface\n✅ Fast loading\n✅ Easy navigation\n✅ Chatbot support (me!)\n\n**Tips for Mobile:**\n1. Add to home screen for quick access\n2. Use landscape for better reports view\n3. Swipe to navigate transactions\n4. Quick add buttons always visible\n\n**On the Go:**\n- Add transactions immediately\n- Check budget status\n- Review spending anytime\n\nManage finances anywhere, anytime!";
    }
    else if (lowerMessage.includes('notification') || lowerMessage.includes('alert') || lowerMessage.includes('reminder')) {
      response = "🔔 **Notifications & Alerts:**\n\n**What You'll Get Notified About:**\n\n⚠️ **Budget Alerts**\n- Approaching budget limit (80%)\n- Budget exceeded\n- Low balance warnings\n\n🎯 **Goal Milestones**\n- 25%, 50%, 75% progress\n- Goal achieved!\n- Deadline approaching\n\n💰 **Transaction Updates**\n- Large expense recorded\n- Income received\n- Unusual activity\n\n📊 **Monthly Reports**\n- Month-end summary\n- Spending insights\n- Suggestions for improvement\n\n**Manage Notifications:**\n- Check notification center\n- Stay informed\n- Take action quickly\n\nStay on top of your finances!";
    }
    
    // General Help
    else if (lowerMessage.includes('help') || lowerMessage.includes('how to use')) {
      response = "👋 **Welcome to MONIVUE Financial Assistant!**\n\nI can help you with:\n\n**💰 Financial Topics:**\n- Saving & budgeting tips\n- Salary management\n- Investment basics\n- Debt management\n- Credit scores\n- Retirement planning\n- Insurance & more\n\n**🌐 Website Features:**\n- How MONIVUE works\n- Using transactions, budgets, goals\n- Navigation & dashboard\n- Reports & analytics\n- Data security\n\n**🔧 Technical Support:**\n- Fix errors and issues\n- Password reset\n- Feature tutorials\n\nAsk me anything about finances or using MONIVUE!";
    }
    else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      response = "👋 Hello! I'm your MONIVUE Financial Assistant. How can I help you today?\n\nI can assist with:\n✅ Financial advice and tips\n✅ Solving technical issues\n✅ Using MONIVUE features\n✅ Managing your money better\n\nWhat would you like to know?";
    }
    else {
      response = "I'm here to help with financial advice and MONIVUE features!\n\n**💡 Try asking:**\n\n**System Access & Features:**\n- 'How to add transaction?'\n- 'How to set budget?'\n- 'How to create goal?'\n- 'How to view reports?'\n- 'How to login/register?'\n- 'How to edit/delete transaction?'\n- 'How does MONIVUE work?'\n- 'How to use dashboard?'\n\n**Financial Topics:**\n- 'How to save money?'\n- 'Managing salary'\n- 'What is inflation?'\n- 'Credit score tips'\n- 'Investment basics'\n- 'Emergency fund'\n- 'Retirement planning'\n\n**Technical Help:**\n- 'Fix errors'\n- 'Forgot password'\n- 'Data security'\n\nWhat would you like to know?";
    }

    res.status(200).json({
      success: true,
      response: response,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process message',
      message: error.message
    });
  }
};

module.exports = { handleChatMessage };
