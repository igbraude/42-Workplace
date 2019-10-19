import { SchemaDirectiveVisitor, AuthenticationError } from "apollo-server";

class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve: defaultResolve } = field;
    field.resolve = function resolve(root, args, context, info) {
      if (!context.user) {
        throw new AuthenticationError('User not authenticated.');
      }
      return defaultResolve(root, args, context, info);
    };
  }
}

export default AuthDirective
