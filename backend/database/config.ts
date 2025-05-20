import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

// Create DynamoDB Client
const dynamoClient = new DynamoDBClient({
    region: 'ap-southeast-2',
})

// Create DocumentClient to simplify data marshalling
const client = DynamoDBDocumentClient.from(dynamoClient)
const table = process.env.TABLE_NAME

export default {
    client,
    table
}
