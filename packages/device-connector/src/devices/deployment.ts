import crypto from 'crypto'
import { createWriteStream } from 'fs'
import * as Path from 'path'
import { Readable } from 'stream'
import { request } from 'undici'
import { Device, getFQBN, getStoredDevice } from './service'
import { promisify } from 'util'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { RPCClient } from '../arduino-cli/client'
import { DeviceResponse } from '../deployment-server/service'

export interface DeploymentData {
  device: DeviceResponse
  artifactUri: string
}

export const downloadFile = async (uri: string, fileName: string, extension: string): Promise<string> => {
  const file = Path.join(dirname(fileURLToPath(import.meta.url)), '../../artifacts', `${fileName}${extension}`)
  const outStream = createWriteStream(file)
  const url = new URL(uri)
  const resp = await request(url)
  const downStream = Readable.from(resp.body)

  downStream.pipe(outStream)

  downStream.on('data', (data) => {
    console.log(data.toString())
  })

  await promisify<'close'>(outStream.on).bind(outStream)('close')

  return file
}

export const downloadArtifact = async (uri: string): Promise<string> => {
  const uid = crypto.randomBytes(32).toString('hex')
  const extension = Path.extname(uri)
  const file = await downloadFile(uri, uid, extension)

  return Path.resolve(file)
}

export const deployBinary = async (deployData: DeploymentData, client: RPCClient): Promise<Device> => {
  const artifactUri = deployData.artifactUri
  const reqDevice = deployData.device as Device

  let device = await getStoredDevice(reqDevice.id)

  if (device == null) {
    throw new Error('Device not found')
  }

  const fqbn = await getFQBN(device.deviceTypeId)
  const artifactPath = await downloadArtifact(artifactUri)

  // Start uploading artifact
  await client.uploadBin(fqbn, device.port, artifactPath)

  return device
}
