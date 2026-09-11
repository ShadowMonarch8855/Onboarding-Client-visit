export const sendWelcomeEmail = async (email, name) => {
  console.log(`[Email Service] Sending welcome email to ${name} (${email})`);
};

export const sendInvoiceEmail = async (email, invoiceNumber, amount) => {
  console.log(`[Email Service] Sending invoice ${invoiceNumber} for ${amount} to ${email}`);
};

export const sendContractEmail = async (email, projectName) => {
  console.log(`[Email Service] Sending contract for project ${projectName} to ${email}`);
};

export const sendPasswordResetEmail = async (email, resetToken) => {
  console.log(`[Email Service] Sending password reset token ${resetToken} to ${email}`);
};
