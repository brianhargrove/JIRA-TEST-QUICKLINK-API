# boilerplate-api

LeisureLink RESTful API boilerplate.

## Description

This repository is a boilerplate/template used to establish a new API that follows LeisureLink's RESTful API conventions and plays nicely in LeisureLink's federated security.

## Using Boilerplate as a Template

This API project does not function as-is because many of the files are templates. It is intended to formalize the conventional layout for LeisureLink RESTful APIs and requires that you **init** your new project from this one.

You can bootstrap a new API by cloning this repository and running the following command:

```bash
node init -n wonderkid
```

The init script performs simple template replacements and results in a new, runnable API with the name `wonderkid-api`. You _should_ use the appropriate name in place of `wonderkid`.

You should also commit & push the newly init'd code to a new repository.

The `init.js` script will create a new 2048 bit RSA key for your API to use in the development environment. The new key is named for your API and is located in your project's root directory: `./wonderkid-dev.pem`. It is your responsibility to register your endpoint key with the _Claims Authority_ in your environment. If your key is not registered then all calls to your API will fail with an `401 - Unauthorized` response.

## What's in the Boilerplate

After you init the boilerplate you'll have a basic API with two working routes:

* `/wonderkid/v1/{lang}/echo`
* `/wonderkid/public/v1/{lang}/status`

The file system layout of the API is significant and should remain consistent as you implement the features of your new API.

```
.\                                    : your API's root
  config\
    wonderkid-spec.json               : your API's config spec

  lib\
    index.js                          : wires up your API's modules
    Logger.js                         : initializes the API's logger
    ...                               : ... other stuff you add

  logs\                               : contains run-time logs

  routes\
    index.js                          : main route import, establishes
                                          public and trusted routes.
    public\                           : contains un-protected,
                                          public, request handlers
      index.js                        : public route import
      status\
        get.js                        : GET /wonderkid/public/v1/{lang}/status
                                          request handler.
    trusted\                          : contains secure, trusted
                                          request handlers
      index.js                        : trusted route import
      echo\
        put.js                        : PUT /wonderkid/v1/{lang}/echo
                                          request handler

  schemas\                            : JSON Schema for your API
    index.js                          : schema import
    echo\
      put.js                          : the request body's schema for the
                                           PUT /wonderkid/v1/{lang}/echo

  app.js                              : THE APP
  app_default_env.js                  : helper module that establishes any
                                          default environment variables needed
                                          to develop and test the app.
  wonderkid-dev.pem                   : Private Key used by the API to sign
                                          requests to other trusted-apps.

  wonderkid-dev.pub                   : Public Key to register with
                                          authentic-api in dev environment.

                                          THESE KEYS ARE FOR DEVELOPMENT
                                          CONVENIENCE AND SHOULD NEVER BE USED
                                          IN PRODUCTION.

  package.json                        : Your API's package definition.


```


