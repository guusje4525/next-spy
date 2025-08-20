export function TableStack() {
    const table = new sst.aws.Dynamo("MainTable", {
        fields: {
            pk: "string",
            sk: "string",
        },
        primaryIndex: {
            hashKey: "pk",
            rangeKey: "sk",
        },
    })

    return {
        table,
        tableName: table.arn,
    }
}
