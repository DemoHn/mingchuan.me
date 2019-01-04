package config

import (
	"mingchuan.me/pkg/configparser"
)

// Config - config object
//type Config = configparser.Config
type IConfig interface {
	Load(string) error
	Find(string) (interface{}, error)
	FindString(string) (string, error)
	FindInt(string) (int, error)
}

var gConfig IConfig

// Init - init config from config dir (yaml)
func Init(configPath string) IConfig {
	if gConfig == nil {
		config := configparser.New("yaml")
		// set macro parser
		/*config.SetMacroParser(func(key string, item interface{}) interface{} {
			// replace $HOME -> <homeDir>
			re := regexp.MustCompile("\\$\\{([^{}]+)\\}")
			// if item is string to replace
			if itemStr, ok := item.(string); ok {

				rawKey := re.FindStringSubmatch(itemStr)[1]
				return re.ReplaceAllString(itemStr, os.Getenv(rawKey))
			}

			return item
		})*/

		config.Load(configPath)
		gConfig = config
	}

	return gConfig
}

// Get - get global instance of config
func Get() IConfig {
	return gConfig
}
