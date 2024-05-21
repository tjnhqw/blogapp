import { generateClient } from 'aws-amplify/api';
import '../configureAmplify';
const client = generateClient();
export default client;
