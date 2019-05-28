import * as path from 'path';
import { getPackageConfigurations } from './get-package-configurations';
import { generateFile, getNxPackageDependencies } from './utils';
import { dedent } from 'tslint/lib/utils';

let template = dedent`
# API

Here is the list of all the available packages inside the Nx ecosystem. You
can see, for each package its dependencies.

| PackageName | Dependencies | PeerDependencies |
| ----------- | ------------ | ---------------- |
`;

const imagesTemplate = dedent`
## Angular
![Angular](./angular.jpg)

## React
![React](./react.jpg)

## Nest
![Nest](./nest.jpg)

## Express
![Express](./express.jpg)

## Node
![Node](./node.jpg)

## Cypress
![Cypress](./cypress.jpg)

## Jest
![Jest](./jest.jpg)

## Web
![Web](./web.jpg)
`;

getPackageConfigurations()
  .filter(item => item.hasBuilders || item.hasSchematics)
  .map(item => {
    const dependencies = getNxPackageDependencies(
      path.join(item.root, 'package.json')
    );

    const data = Object.assign(
      {},
      {
        hasBuilders: item.hasBuilders,
        hasSchematics: item.hasSchematics
      },
      dependencies
    );

    template += dedent`| ${data.name} | ${data.dependencies.join(
      ', '
    )} | ${data.peerDependencies.join(', ')} |\n`;
  });

// Adding images of dependency graphs
template += imagesTemplate;

generateFile(path.join(__dirname, '../../docs', 'api'), {
  name: 'home',
  template
});
console.log('Done generating API Home Documentation');
