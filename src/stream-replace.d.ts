declare module 'stream-replace'{
	export default function streamReplace(pattern: string | RegExp, replace: string | Function): NodeJS.ReadWriteStream
}
