import {Injectable} from '@angular/core';

@Injectable()
export class FileService {
	downloadFile(data: string, name: string, type: string) {
		var a = window.document.createElement('a');
		a.href = window.URL.createObjectURL(new Blob([data], { type: type }));
		a.download = name;

		// Append anchor to body.
		document.body.appendChild(a)
		a.click();

		// Remove anchor from body
		document.body.removeChild(a)
	}

	getContent(fileInput: string, callback: any) {
		var input:any = document.getElementById('fileinput');

		var file = input.files[0];
		var fr = new FileReader();
		fr.onload = callback;
		fr.readAsText(file);
	}
}
