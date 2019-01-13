package account

import (
	"time"

	"github.com/jinzhu/gorm"
	"mingchuan.me/app/drivers/swagger"
)

// NewService - new service
func NewService(db *gorm.DB, secret string) *AccountService {
	jwtDuration, _ := time.ParseDuration("24h")
	return &AccountService{
		DB:      db,
		Version: AccountServiceVersion,
		JWTConfig: &AccountJWTConfig{
			ExpireIn: time.Duration(jwtDuration),
			Issuer:   Issuer,
			Secret:   secret,
		},
	}
}

// Init - do initialization on the service
func (srv *AccountService) Init() error {
	var err error
	if err = srv.DB.AutoMigrate(&Account{}).Error; err != nil {
		return err
	}

	if err = srv.GenerateAdminKey(); err != nil {
		return err
	}
	return nil
}

// RegisterAPI -
func (srv *AccountService) RegisterAPI(api *swagger.API) {
	c := NewController(api, srv)
	// bind routes
	c.RegisterAdmin()
	c.Login()
}
