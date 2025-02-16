import { ContainerModule } from "@theia/core/shared/inversify";
import { CdtcloudWidget } from "./cdtcloud-widget";
import { CdtcloudContribution } from "./cdtcloud-contribution";
import {
  bindViewContribution,
  FrontendApplicationContribution,
  WebSocketConnectionProvider,
  WidgetFactory,
} from "@theia/core/lib/browser";

import "../../src/browser/style/index.css";
import {
  CompilationService,
  COMPILATION_PATH,
  ConfigService,
  CONFIG_PATH,
  DeviceTypeService,
  DEVICE_TYPES_PATH,
} from "../common/protocol";
import { DeploymentManager } from "./monitoring/DeploymentManager";

export default new ContainerModule((bind) => {
  bindViewContribution(bind, CdtcloudContribution);
  bind(FrontendApplicationContribution).toService(CdtcloudContribution);
  bind(CdtcloudWidget).toSelf();
  bind(WidgetFactory)
    .toDynamicValue((ctx) => ({
      id: CdtcloudWidget.ID,
      createWidget: () => ctx.container.get<CdtcloudWidget>(CdtcloudWidget),
    }))
    .inSingletonScope();

  bind(DeploymentManager).toSelf().inSingletonScope();

  bind(DeviceTypeService)
    .toDynamicValue((ctx) => {
      const connection = ctx.container.get(WebSocketConnectionProvider);
      return connection.createProxy<DeviceTypeService>(DEVICE_TYPES_PATH);
    })
    .inSingletonScope();

  bind(CompilationService)
  .toDynamicValue((ctx) => {
    const connection = ctx.container.get(WebSocketConnectionProvider);
    return connection.createProxy<CompilationService>(COMPILATION_PATH);
  })
  .inSingletonScope();

  bind(ConfigService)
  .toDynamicValue((ctx) => {
    const connection = ctx.container.get(WebSocketConnectionProvider);
    return connection.createProxy<ConfigService>(CONFIG_PATH);
  })
  .inSingletonScope();

});
