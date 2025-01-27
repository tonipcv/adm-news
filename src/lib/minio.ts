import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  endpoint: "https://minios3-minio.dpbdp1.easypanel.host",
  credentials: {
    accessKeyId: "gustavo",
    secretAccessKey: "mysecretkey1234567890"
  },
  region: "us-east-1", // região padrão
  forcePathStyle: true,
  tls: true,
  requestHandler: {
    abortSignal: undefined,
    connectionTimeout: 5000,
    keepAlive: true,
  }
}); 