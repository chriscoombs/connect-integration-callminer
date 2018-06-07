var response = require('cfn-response');
var http = require('http');

exports.handler = function(event, context) {
  var customerId = event.ResourceProperties.VAR_ExternalId;
  var s3BucketName = event.ResourceProperties.VAR_S3BucketName;
  var s3BucketKMSKeyARN = event.ResourceProperties.VAR_S3BucketKMSKeyARN;
  var kinesisStreamARN = event.ResourceProperties.VAR_KinesisStreamARN;
  var kinesisKMSKeyARN = event.ResourceProperties.VAR_KinesisStreamKMSKeyARN;
  var post_data = `{'CUSTOMER_ID':'${customerId}', 'S3BUCKET_NAME':'${s3BucketName}', 'S3BUCKET_KMS_ARN':'${s3BucketKMSKeyARN}', 'KINESIS_STREAM_ARN':'${kinesisStreamARN}', 'KINESIS_KMS_ARN':'${kinesisKMSKeyARN}'}`;
  var post_options = {
    host: '54.175.107.103',
    port: '80',
    path: '/api/values',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(post_data)
    }
  };

  var post_req = http.request(post_options, function(res) {
    if (res.statusCode == 200) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        console.log('res: ' + chunk);
      });
      response.send(event, context, response.SUCCESS, {'setupstatus': 'Successfully created cross account role.'});
    }
    else {
      response.send(event, context, response.FAILED, {'setupstatus': 'An unexpected error occured while creating cross account role.  Please contact customer support at support@callminer.com'});
    }
  });
  
  post_req.write(post_data);
  post_req.end();
};
