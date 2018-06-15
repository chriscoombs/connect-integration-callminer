/* Copyright 2015 Amazon Web Services, Inc. or its affiliates. All Rights Reserved.
   This file is licensed to you under the AWS Customer Agreement (the "License").
   You may not use this file except in compliance with the License.
   A copy of the License is located at http://aws.amazon.com/agreement/ .
   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, express or implied.
   See the License for the specific language governing permissions and limitations under the License. */

exports.handler = (event, context, callback) => {
  var response = require('./cfn-response');
  var http = require('https');
  var customerId = event.ResourceProperties.VAR_ExternalId;
  var s3BucketName = event.ResourceProperties.VAR_S3BucketName;
  var s3BucketKMSKeyARN = event.ResourceProperties.VAR_S3BucketKMSKeyARN;
  var kinesisStreamARN = event.ResourceProperties.VAR_KinesisStreamARN;
  var kinesisKMSKeyARN = event.ResourceProperties.VAR_KinesisStreamKMSKeyARN;
  var iamRoleARN = event.ResourceProperties.VAR_IAMRoleARN;
  var post_data = `{'CUSTOMER_ID':'${customerId}', 'S3BUCKET_NAME':'${s3BucketName}', 'S3BUCKET_KMS_ARN':'${s3BucketKMSKeyARN}', 'KINESIS_STREAM_ARN':'${kinesisStreamARN}', 'KINESIS_KMS_ARN':'${kinesisKMSKeyARN}', 'IAM_ROLE_ARN':'${iamRoleARN}'}`;
  var post_options = {
    host: 'register.callminer.net',
    port: '443',
    path: '/api/amazonconnectcallback',
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
