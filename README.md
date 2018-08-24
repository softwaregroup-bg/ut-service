# ut-service
Service wrapper

## usage
Ut-service can be used in 2 different ways:

1) As a replacement of ut-run. In index.js in the root of the project:

    ```
    required('ut-service').run({version, main})
    ```
    where:

* `version` is the package.json version. E.g. ```version: require('./package.json').version```
* `main` is the main application entry point and can contain a collection of services or bussiness module pacakges as described in [ut-run](https://github.com/softwaregroup-bg/ut-run#services):

2) As a single module package as described in ut-run. I.e. in Service startup file `server/index.js`
    ```
    module.exports = ({config}) => [
        require('ut-service'),
        package2,
        //...
        packageN
    ];
    ```
