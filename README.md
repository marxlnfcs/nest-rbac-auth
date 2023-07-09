# Extended decorator functions for the @nestjs/swagger module

[![npm](https://ico.y.gy/npm/dm/@marxlnfcs/nest-swagger-decorators?style=flat-square&logo=npm)](https://www.npmjs.com/package/@marxlnfcs/nest-swagger-decorators)
[![NPM](https://ico.y.gy/npm/l/@marxlnfcs/nest-swagger-decorators?style=flat-square&color=brightgreen)](https://www.npmjs.com/package/@marxlnfcs/nest-swagger-decorators)
[![3Snyk Vulnerabilities for npm package](https://ico.y.gy/snyk/vulnerabilities/npm/@marxlnfcs/nest-swagger-decorators?style=flat-square&logo=snyk)](https://snyk.io/test/npm/@marxlnfcs/nest-swagger-decorators)
[![Website](https://ico.y.gy/website?down_color=red&down_message=offline&label=repository&up_color=success&up_message=online&url=https%3A%2F%2Fgithub.com%2Fmarxlnfcs%2Fnest-swagger-decorators&style=flat-square&logo=github)](https://github.com/marxlnfcs/nest-swagger-decorators)

## Installation
```
npm i @marxlnfcs/nest-swagger-decorators
```

## Usage
### Controller
```javascript
@ApiController('/', {
    tags: { ... },
    header: { ... },
    params: { ... },
    query: { ... },
})
export class AppController {}

@ApiController({
    path: '/',
    tags: { ... },
    header: { ... },
    params: { ... },
    query: { ... },
})
export class AppController {}

// Controller will not be added to the documentation. Equals to @ApiExcludeController
@ApiController('/', false)
export class AppController {}
```

### Routes
```javascript
@ApiController('/')
export class AppController {

    @ApiGet('/', { ... })
    @ApiGet({ path: '/', ... })
    @ApiGet('/', false) // Endpoint will not be added to the documentation. Equals to @ApiExcludeEndpoint
    ping(){ ... }

}
```

### Exceptions
```javascript
@ApiController('/')
export class AppController {
    
    @ApiGet('/')
    @ApiNotFoundException()
    @ApiUnauthorizedException()
    ping(){ ... }
    
}
```