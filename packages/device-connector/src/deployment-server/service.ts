import { env } from 'process'
import { fetch } from 'undici'
import { connectorId } from './connection'
import { DeviceStatus } from '../util/common'
import { DeviceType } from '../devices/service'
import { DeploymentData } from '../devices/deployment'

export interface DeviceResponse {
  id: string
  status: keyof typeof DeviceStatus
  deviceTypeId: string
}

export interface DeployServRequest {
  type: string
  data: DeploymentData
}

export const sendNewDeviceTypeRequest = async (fqbn: string, name: string): Promise<DeviceType> => {
  const address = env.SERVER_URI != null ? env.SERVER_URI : '127.0.0.1:3001'
  const url = `http://${address}/device-types`

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      fqbn,
      name
    })
  })

  return await resp.json() as DeviceType
}

export const sendNewDeviceRequest = async (typeId: string): Promise<DeviceResponse> => {
  const address = env.SERVER_URI != null ? env.SERVER_URI : '127.0.0.1:3001'
  const url = `http://${address}/devices`

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      typeId,
      connectorId,
      status: DeviceStatus.AVAILABLE
    })
  })

  return await resp.json() as DeviceResponse
}

export const setDeviceRequest = async (deviceId: string, data: object): Promise<DeviceResponse> => {
  const address = env.SERVER_URI != null ? env.SERVER_URI : '127.0.0.1:3001'
  const url = `http://${address}/devices/${deviceId}`

  const resp = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  return await resp.json() as DeviceResponse
}

export const fetchAllDeviceTypes = async (): Promise<DeviceType[]> => {
  const address = env.SERVER_URI != null ? env.SERVER_URI : '127.0.0.1:3001'
  const url = `http://${address}/device-types`

  const resp = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await resp.json() as DeviceType[]
}

export const fetchDeviceType = async (typeId: string): Promise<DeviceType> => {
  const address = env.SERVER_URI != null ? env.SERVER_URI : '127.0.0.1:3001'
  const url = `http://${address}/device-types/${typeId}`

  const resp = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await resp.json() as DeviceType
}

export const deleteDeviceRequest = async (deviceId: string): Promise<void> => {
  const address = env.SERVER_URI != null ? env.SERVER_URI : '127.0.0.1:3001'
  const url = `http://${address}/devices/${deviceId}`

  await fetch(url, {
    method: 'DELETE'
  })
}
