import baseJoi, { AnySchema, SchemaMap } from 'joi';

const regexJoiExt: baseJoi.Extension = ( localJoi: typeof baseJoi ) =>
	( {
		base: localJoi.object(),

		language: {
			datetime: 'must be a valid regex instance',
		},
		name: 'regex',
		rules: [{
			name: 'regex',
			validate( params, value, state, options ) {
				if ( value instanceof RegExp ) {
					return value;
				} else {
					return this.createError( 'object.regex', { value }, state, options );
				}
			},
		}] as baseJoi.Rules[],
	} );
const joi = baseJoi.extend( regexJoiExt );

export const {
	alternatives,
	array: isArray,
	func: isFunc,
	object: isObject,
	ref,
	regex: isRegex,
	string: isString,
	boolean: isBoolean,
} = joi;
export const schemaFor = <T extends {}>( schema: SchemaMap & {[key in keyof T]: AnySchema} ) => isObject().keys( schema );
