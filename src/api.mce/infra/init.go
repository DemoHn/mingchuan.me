package infra

import (
	"mingchuan.me/infra/config"
	"mingchuan.me/infra/logger"
)

// Init - init infra helpers - including config, logger
func Init(configFile string, debugMode bool) (config.IConfig, *logger.Logger) {
	configN := config.Init(configFile)
	log := logger.Init(debugMode)

	return configN, log
}
