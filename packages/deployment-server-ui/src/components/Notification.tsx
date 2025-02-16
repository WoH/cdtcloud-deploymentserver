import { notification } from 'antd'
import { DisconnectOutlined, InfoOutlined, LinkOutlined } from '@ant-design/icons'
import React, { CSSProperties } from 'react'
import { Connector, Device } from 'deployment-server'
import { ServerMessage } from '../services/WebsocketService'
import { typeIdToName } from '../util/deviceMapping'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CrossedIcon } from './CrossedIcon'

import styles from './Notification.module.scss'

export const openNotification = async (
  title: string | JSX.Element, content: JSX.Element, icon: JSX.Element,
  className?: string, style?: CSSProperties, onClick?: () => void
): Promise<void> => {
  notification.info({
    message: title,
    icon,
    description: content,
    placement: 'bottomRight',
    duration: 8,
    className,
    style,
    onClick
  })
}

export const connectorEvent = async (resp: ServerMessage): Promise<void> => {
  const type = resp.type

  if (type === 'connector') {
    const event = resp.data.event
    const connector = resp.data.connector as Connector

    let icon: JSX.Element
    let titleEvent: string

    switch (event) {
      case 'add':
        icon = <FontAwesomeIcon icon={'plug'}/>
        titleEvent = 'added'
        break
      case 'remove':
        icon = <CrossedIcon icon={<FontAwesomeIcon icon={'plug'}/>}/>
        titleEvent = 'removed'
        break
      case 'connect':
        icon = <LinkOutlined/>
        titleEvent = 'connected'
        break
      case 'disconnect':
        titleEvent = 'disconnected'
        icon = <DisconnectOutlined/>
        break
      default:
        icon = <InfoOutlined/>
        titleEvent = 'Info'
        break
    }

    const connectorMessage = (
      <>
        Id: {connector.id}
      </>
    )
    await openNotification(`Connector ${titleEvent}`, connectorMessage, icon)
  }
}

export const deviceEvent = async (resp: ServerMessage): Promise<void> => {
  const type = resp.type

  if (type === 'device') {
    const event = resp.data.event
    const device = resp.data.device as Device

    let icon: JSX.Element
    let titleEvent: string

    switch (event) {
      case 'add':
        icon = <FontAwesomeIcon icon={'microchip'}/>
        titleEvent = 'added'
        break
      case 'remove':
        icon = <CrossedIcon icon={<FontAwesomeIcon icon={'microchip'}/>}/>
        titleEvent = 'removed'
        break
      default:
        icon = <InfoOutlined/>
        titleEvent = 'Info'
        break
    }

    const deviceTypeName = await typeIdToName(device.deviceTypeId)
    const title = `Device ${titleEvent}`
    const deviceMessage = (
      <>
        Id: {device.id}
        <br/>
        Connector: {device.connectorId}
        <br/>
        Type: {deviceTypeName}
      </>
    )
    await openNotification(title, deviceMessage, icon, styles.clickable, undefined, () => {
      location.href = '/devices'
    })
  }
}
