import { WebhookClient } from 'discord.js';
import { apiCall } from './api.js';

export const handleWebhook = async (webhookUrl: string, policyFile: string) => {
  const webhookClient = new WebhookClient({ url: webhookUrl });

  try {
    // Trigger policy validation
    const validationResponse = await apiCall('validate', 'POST', policyFile);
    if (validationResponse.status !== 200) {
      throw new Error(`Policy validation failed: ${validationResponse.status}`);
    }

    // Trigger policy deployment
    const deploymentResponse = await apiCall('deploy', 'POST', policyFile);
    if (deploymentResponse.status !== 200) {
      throw new Error(`Policy deployment failed: ${deploymentResponse.status}`);
    }

    // Send success message to webhook
    await webhookClient.send({
      content: `Policy validation and deployment successful for ${policyFile}`,
    });
  } catch (error) {
    // Send error message to webhook
    await webhookClient.send({
      content: `Error during policy validation and deployment: ${error.message}`,
    });
  }
};
