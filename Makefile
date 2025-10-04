PKG_ID := $(shell yq e ".id" manifest.yaml)
PKG_VERSION := $(shell yq e ".version" manifest.yaml)
TS_FILES := $(shell find scripts -name \*.ts 2>/dev/null || echo "")

# Delete the target of a rule if it has changed and its recipe exits with a nonzero exit status
.DELETE_ON_ERROR:

all: verify

verify: toshi-moto-startos.s9pk
	@echo "Verifying package..."
	@start-sdk verify s9pk toshi-moto-startos.s9pk
	@echo "Package verification complete!"

install: hello-world-fullstack.s9pk
	@echo "Installing package..."
	@start-cli package install toshi-moto-startos.s9pk

clean:
	rm -rf docker-images
	rm -f toshi-moto-startos.s9pk
	rm -f scripts/*.js

toshi-moto-startos.s9pk: manifest.yaml instructions.md LICENSE icon.png docker-images/aarch64.tar docker-images/x86_64.tar
	@echo "Packing service..."
	@start-sdk pack

docker-images/aarch64.tar: Dockerfile docker_entrypoint.sh check-web.sh nginx.conf $(TS_FILES)
	mkdir -p docker-images
	docker buildx build --tag start9/$(PKG_ID)/main:$(PKG_VERSION) --platform=linux/arm64 -o type=docker,dest=docker-images/aarch64.tar .

docker-images/x86_64.tar: Dockerfile docker_entrypoint.sh check-web.sh nginx.conf $(TS_FILES)
	mkdir -p docker-images
	docker buildx build --tag start9/$(PKG_ID)/main:$(PKG_VERSION) --platform=linux/amd64 -o type=docker,dest=docker-images/x86_64.tar .

.PHONY: all verify install clean
