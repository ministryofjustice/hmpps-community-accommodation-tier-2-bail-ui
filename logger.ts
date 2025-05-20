import bunyan, { LogLevel } from 'bunyan'
import bunyanFormat from 'bunyan-format'
import config from './server/config'

const formatOut = bunyanFormat({ outputMode: 'short', color: !config.production })

const logger = bunyan.createLogger({
  name: 'HMPPS Community Accommodation Tier 2 Bail Ui',
  stream: formatOut,
  level: config.logLevel as LogLevel,
})

export default logger
