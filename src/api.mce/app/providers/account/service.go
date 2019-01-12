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
	"mingchuan.me/infra/config"
)

// GenerateAdminKey - generate an admin key
func (acct *AccountService) GenerateAdminKey() error {
	var err error
	configN := config.Get()

	// set random seed
	rand.Seed(time.Now().UTC().UnixNano())

	var adminKeyFile string
	if adminKeyFile, err = configN.FindString("global.admin_key_file"); err != nil {
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

// RegisterAndSign - register the account to db, and sign the jwt for it
func (acct *AccountService) RegisterAndSign(name string, password string, adminKey string) (jwt string, err error) {
	db := acct.DB

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
	if err = db.Create(&newAccount).Error; err != nil {
		jwt = ""
		return
	}

	// construct payload
	payload := map[string]interface{}{
		"accountId": newAccount.ID,
	}
	if jwt, err = signJWT(payload, acct.JWTConfig); err != nil {
		return
	}

	return
}

// VerifyAccount - check if account is correct
func (acct *AccountService) VerifyAccount(name string, password string) (jwt string, err error) {
	db := acct.DB

	var hash []byte
	// generate password hash
	if hash, err = genHashPassword(password); err != nil {
		return
	}

	var nameAccount Account
	if err = db.Find(&nameAccount, "name = ?", name).Error; err != nil {
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
	if jwt, err = signJWT(payload, acct.JWTConfig); err != nil {
		return
	}

	return
}

// internal function
// signJWT - sign auth JWT
func signJWT(payload map[string]interface{}, config *AccountJWTConfig) (jwt string, err error) {
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
