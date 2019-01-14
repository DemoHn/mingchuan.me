package account

import (
	"bytes"
	"crypto/sha256"
	"errors"
	"fmt"
	"io/ioutil"
	"math/rand"
	"os"
	"time"

	jwtLib "github.com/dgrijalva/jwt-go"
	"mingchuan.me/app/drivers/gorm"
	"mingchuan.me/infra"
	"mingchuan.me/infra/config"
)

// jwtConfig - defines signed JWT related config
// Notice: The sign algorithm is hardcored as HS256
type jwtConfig struct {
	ExpireIn time.Duration // unit: second
	Issuer   string
	Secret   string
}

// Service - account service
type Service struct {
	DB    *gorm.Driver
	infra *infra.Infrastructure
	*jwtConfig
}

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

/* config */

// PermMask - Permission Item
type PermMask int

const (
	// None - no permission
	None PermMask = 0
	// Admin - has admin permission
	Admin PermMask = 1
)

const (
	// Issuer - JWT `issuer` field
	Issuer = "mingchuan.me"
)

// NewService - new service
func NewService(infra *infra.Infrastructure, db *gorm.Driver) (*Service, error) {
	var err error
	// migrate db
	if err = db.AutoMigrate(&Account{}).Error(); err != nil {
		return nil, err
	}
	// generate adminKey
	if err = generateAdminKey(infra); err != nil {
		return nil, err
	}
	// get secret
	var secret string
	if secret, err = infra.Config.FindString("global.admin_jwt_secret"); err != nil {
		return nil, err
	}

	jwtDuration, _ := time.ParseDuration("24h")
	return &Service{
		DB:    db,
		infra: infra,
		jwtConfig: &jwtConfig{
			ExpireIn: time.Duration(jwtDuration),
			Issuer:   Issuer,
			Secret:   secret,
		},
	}, nil
}

// GenerateAdminKey -
func (s *Service) GenerateAdminKey() error {
	return generateAdminKey(s.infra)
}

// RegisterAdmin - register the admin account to db, and returns sign the jwt for it
func (s *Service) RegisterAdmin(name string, password string, adminKey string) (jwt string, err error) {
	db := s.DB

	var hash []byte
	// validate password
	if err = validatePassword(password); err != nil {
		return
	}
	// generate password hash
	if hash, err = genHashPassword(password); err != nil {
		return
	}

	var mask = Admin
	var adminKeyF string
	if adminKeyF, err = readAdminKey(); err != nil {
		return
	}
	// compareKey
	if adminKeyF != adminKey {
		err = fmt.Errorf("unmatch adminKey")
		return
	}
	newAccount := Account{
		Name:           name,
		PasswordHash:   hash,
		PermissionMask: mask,
	}
	// insert into db
	if err = db.Create(&newAccount).Error(); err != nil {
		jwt = ""
		return
	}

	// construct payload
	payload := map[string]interface{}{
		"accountId": newAccount.ID,
	}
	if jwt, err = signJWT(payload, s.jwtConfig); err != nil {
		return
	}

	return
}

// VerifyAccount - check if account is correct
func (s *Service) VerifyAccount(name string, password string) (jwt string, err error) {
	db := s.DB

	var hash []byte
	// generate password hash
	if hash, err = genHashPassword(password); err != nil {
		return
	}

	var nameAccount Account
	if err = db.Find(&nameAccount, "name = ?", name).Error(); err != nil {
		return
	}

	// compare oldHash and newHash
	if bytes.Compare(nameAccount.PasswordHash, hash) != 0 {
		err = errors.New("invalid password")
		return
	}

	// construct payload
	payload := map[string]interface{}{
		"accountId": nameAccount.ID,
	}
	if jwt, err = signJWT(payload, s.jwtConfig); err != nil {
		return
	}

	return
}

// internal function
// signJWT - sign auth JWT
func signJWT(payload map[string]interface{}, config *jwtConfig) (jwt string, err error) {
	claims := jwtLib.MapClaims{}
	var expTime int64
	for key, val := range payload {
		claims[key] = val
	}

	claims["iss"] = config.Issuer
	expTime = time.Now().Add(config.ExpireIn).Unix()
	claims["exp"] = expTime

	token := jwtLib.NewWithClaims(jwtLib.SigningMethodHS256, claims)
	jwt, err = token.SignedString([]byte(config.Secret))
	return
}

func generateAdminKey(infra *infra.Infrastructure) error {
	var err error
	config := infra.Config
	// set random seed
	rand.Seed(time.Now().UTC().UnixNano())

	var adminKeyFile string
	if adminKeyFile, err = config.FindString("global.admin_key_file"); err != nil {
		return err
	}

	var keyExists = true
	if _, err = os.Stat(adminKeyFile); os.IsNotExist(err) {
		keyExists = false
	} else {
		// read file data
		var c []byte
		if c, err = ioutil.ReadFile(adminKeyFile); err != nil {
			return err
		}

		if len(c) == 0 {
			keyExists = false
		}
	}
	// write data if key not exists
	if keyExists == false {
		b := make([]byte, 20)
		for i := range b {
			b[i] = byte(rand.Intn(26) + 65)
		}
		return ioutil.WriteFile(adminKeyFile, b, 0644)
	}

	return nil
}

func genHashPassword(password string) (hash []byte, err error) {
	// TODO: use pdkdf2
	sum := sha256.Sum256([]byte(password))
	return sum[:], nil
}

// validatePassword - check if password format
// fits the reuqirement, e.g.: length within 6-10 digits,
// must include numbers, etc.
func validatePassword(password string) error {
	// TODO: add logic
	return nil
}

func readAdminKey() (string, error) {
	var err error
	configN := config.Get()

	var adminKeyFile string
	if adminKeyFile, err = configN.FindString("global.admin_key_file"); err != nil {
		return "", err
	}

	var content []byte
	if content, err = ioutil.ReadFile(adminKeyFile); err != nil {
		return "", fmt.Errorf("read admin key failed: %s", err.Error())
	}

	return string(content), nil
}
