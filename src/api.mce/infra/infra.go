package infra

import (
	"mingchuan.me/infra/config"
	"mingchuan.me/infra/logger"
)

// Infrastructure defines the basic components that nearly every providers & drivers
// will use. (e.g. logger)
type Infrastructure struct {
	Config config.IConfig
	Logger *logger.Logger
}

// New - New Infrastructure
func New(configFile string, debugMode bool) *Infrastructure {
	return &Infrastructure{
		Config: config.Init(configFile),
		Logger: logger.Init(debugMode),
	}
}

// Init - init infra helpers - including config, logger
func Init(configFile string, debugMode bool) (config.IConfig, *logger.Logger) {
	configN := config.Init(configFile)
	log := logger.Init(debugMode)

	return configN, log
}
