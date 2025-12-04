export interface CopyOptions {
  enabled?: boolean; //! true
  //todo handle object type in serializer and deSerializer
  serializer?: (data: Record<string, any>) => string;
  deSerializer?: (text: string) => Record<string, any>;
}
