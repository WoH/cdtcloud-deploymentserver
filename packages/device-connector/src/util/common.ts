export enum DeviceStatus {
  UNAVAILABLE = 'UNAVAILABLE',
  AVAILABLE = 'AVAILABLE',
  DEPLOYING = 'DEPLOYING',
  MONITORING = 'MONITORING',
  RUNNING = 'RUNNING'
}

export enum DeployStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  TERMINATED = 'TERMINATED'
}
