import { MessageService } from "@theia/core";
import { inject, injectable } from "@theia/core/shared/inversify";
import { OutputChannel, OutputChannelManager, OutputChannelSeverity } from "@theia/output/lib/browser/output-channel";
import { ConfigService, Deployment } from "../../common/protocol";

@injectable()
export class DeploymentManager {


  constructor(
    @inject(OutputChannelManager)
    protected readonly outputChannelManager: OutputChannelManager,

    @inject(MessageService)
    protected readonly messageService: MessageService,

    @inject(ConfigService)
    protected readonly configService: ConfigService,

  ) {
    this.messageService.info('DeploymentManager initialized');
  }

  public async postDeploy(deployment: Deployment): Promise<void> {
    const channel = this.outputChannelManager.getChannel(`Deployment ${deployment.id}`);

    this.registerWebSocket(deployment.id, channel);

  }

  private async registerWebSocket(deploymentId: string, channel: OutputChannel) {
    const socket = new WebSocket(`${await this.configService.getWebsocketHost()}/api/deployments/${deploymentId}/stream`);

    socket.onopen = () => {
      channel.show({preserveFocus: true});
      channel.appendLine('Connected to deployment');
    }

    socket.onmessage = (event) => {
      const data = event.data.toString().trim()
      if (data != '') {
        channel.appendLine(data);
      }
    }

    socket.onerror = (_event) => {
      channel.appendLine('Error', OutputChannelSeverity.Error);
    }

    socket.onclose = () => {
      channel.appendLine('Disconnected');
    }
  }
}
