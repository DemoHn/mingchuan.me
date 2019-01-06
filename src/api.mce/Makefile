# parameters
GOCMD=go
GODEP=dep
RM=rm
MV=mv
GOCLEAN=$(GOCMD) clean
GOBUILD=$(GOCMD) build
GOTEST=$(GOCMD) test

BINARY=/app/bin/mce
BINPATH=$(BINARY)
LDFLAGS=-ldflags "-s -w"
GOPATH=/go
env:
# install deps
dep:
	GOPATH=$(GOPATH) $(GODEP) ensure -v

clean:
	GOPATH=$(GOPATH) $(GOCLEAN)
	$(RM) -f $(BINPATH)

clean-swagger:	
	$(RM) -rf ./api/restapi ./api/models # rm swagger api gen'ed dir	

test:
	GOPATH=$(GOPATH) $(GOTEST) -v ./...

# build
build: clean swagger
	CGO_ENABLED=0 GOPATH=$(GOPATH) $(GOBUILD) $(LDFLAGS) -o $(BINPATH) -v main.go

docker: 
	docker-compose up

# API server
swagger: clean-swagger
	GOPATH=$(GOPATH) swagger generate server -t api -f ./api/swagger.yml --exclude-main -A mce	