import emailjs from 'emailjs-com';

export function sendNotificationEmail({ email, name, salaryTips, goals, budgets, message }) {
  return emailjs.send(
    process.env.REACT_APP_EMAILJS_SERVICE_ID,
    process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
    {
      email,
      name,
      salaryTips,
      goals,
      budgets,
      message,
    },
    process.env.REACT_APP_EMAILJS_PUBLIC_KEY
  );
}
