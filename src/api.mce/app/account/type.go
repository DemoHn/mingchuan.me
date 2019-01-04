package account

import (
	"time"

	"github.com/jinzhu/gorm"
)

const (
	// AccountServiceVersion - define version
	AccountServiceVersion = 1
	// Issuer - JWT `issuer` field
	Issuer = "mingchuan.me"
)

// Account - Model: main account model
type Account struct {
	ID int `gorm:"primary_key" json:"id"`
	// Name - account name
	Name string `gorm:"type:varchar(255); not null; unique"`
	// PasswordHash - password hash (sha1)
	PasswordHash []byte `gorm:"type:blob; not null"`
	// PermissionMask - an integer to present permission
	PermissionMask PermMask `gorm:"type: integer; default 0"`
}

// AccountService - service object
type AccountService struct {
	*gorm.DB
	Version   uint16
	JWTConfig *AccountJWTConfig
}

/* config */
// AccountJWTConfig - defines signed JWT related config
// Notice: The sign algorithm is hardcored as HS256
type AccountJWTConfig struct {
	ExpireIn time.Duration // unit: second
	Issuer   string
	Secret   string
}

// PermMask - Permission Item
type PermMask int

const (
	// None - no permission
	None PermMask = 0
	// Admin - has admin permission
	Admin PermMask = 1
)
