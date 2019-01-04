package middlewares

import (
	"errors"
	"fmt"
	"net/http"
	"strings"

	"mingchuan.me/api"

	gErrors "mingchuan.me/app/errors"

	"github.com/dgrijalva/jwt-go"
	"mingchuan.me/infra/config"
	"mingchuan.me/util"
)

type authSchemaType = string

const (
	// PUBLIC - everyone could use it
	PUBLIC authSchemaType = "PUBLIC"
	// ADMIN - only admin could use those APIs
	ADMIN authSchemaType = "ADMIN"
)

// Auth - auth middleware
// Some APIs requires sepecial authentication credentials.
// For example, APIs start with `/admin` are
// required to have admin access
//
// Headers:
// Auth-Schema: PUBLIC | ADMIN
// Authorization: Bearer <jwt>
func Auth(handler api.HandlerFunc) api.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) *gErrors.Error {
		err := validateAuthSchema(w, r)
		if err != nil {
			return err
		}

		return handler(w, r)
	}
}

func validateAuthSchema(w http.ResponseWriter, r *http.Request) *gErrors.Error {
	var wErr *gErrors.Error

	headers := r.Header
	path := r.URL.Path

	authSchema := headers.Get("Auth-Schema")
	authorization := headers.Get("Authorization")

	// check if schema is correct
	allowedSchema := filterAllowedSchema(path)

	if util.Contains(allowedSchema, authSchema) == false {
		wErr = gErrors.AuthSchemaValidationError(authSchema, allowedSchema)
	}

	if err := verifyAuthorization(authSchema, authorization); err != nil {
		wErr = gErrors.AuthKeyValidationError(err)
	}

	return wErr
}

func verifyAuthorization(schema string, authorization string) error {
	// TODO: add verify JWT logic
	// if schema = PUBLIC, authorization field could be empty string
	configN := config.Get()
	var err error
	var adminJwtSecret string
	if adminJwtSecret, err = configN.FindString("global.admin_jwt_secret"); err != nil {
		return err
	}
	if schema != PUBLIC {
		if strings.Index(authorization, "Bearer") < 0 {
			return errors.New("invalid Auth format")
		}
		// len("Bearer ") = 7
		authJwt := authorization[7:]
		// parse jwt
		token, err := jwt.Parse(authJwt, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("invalid jwt algorithm: %s", token.Header["alg"])
			}

			return []byte(adminJwtSecret), nil
		})

		if _, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			return nil
		}
		return err
	}
	return nil
}

func filterAllowedSchema(path string) []authSchemaType {
	// ADMIN
	if strings.Index(path, "/admin/") >= 0 {
		return []authSchemaType{
			ADMIN,
		}
	}
	// PUBLIC
	return []authSchemaType{
		PUBLIC,
	}
}
