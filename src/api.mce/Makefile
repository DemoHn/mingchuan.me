# parameters
GOCMD=go
GODEP=dep
RM=rm
MV=mv
GOCLEAN=$(GOCMD) clean
GOBUILD=$(GOCMD) build
GOTEST=$(GOCMD) test

BINARY=mce
BINPATH=$(BINARY)
LDFLAGS=-ldflags "-s -w"

clean:
	GOPATH=$(GOPATH) $(GOCLEAN)
	$(RM) -f $(BINPATH)

clean-swagger:
	$(RM) -rf ./app/drivers/swagger/restapi ./app/drivers/swagger/models # rm swagger api gen'ed dir

test:
	$(GOTEST) -v ./...

# build
build: clean swagger
	CGO_ENABLED=0 $(GOBUILD) $(LDFLAGS) -o $(BINPATH) -v main.go

docker:
	docker-compose up

# API server
swagger: clean-swagger
	swagger generate server -t app/drivers/swagger -f ./api/swagger.yml --exclude-main -A mce