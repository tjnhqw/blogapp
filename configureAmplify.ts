import { Amplify } from 'aws-amplify';
import config from './src/aws-exports';
Amplify.configure(config);
// console.log(Amplify.getConfig().Auth?.Cognito.userAttributes);
