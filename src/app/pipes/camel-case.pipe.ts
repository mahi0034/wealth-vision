import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone:true,
  name: 'camelCase'
})
export class CamelCasePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;

    // Trim any leading/trailing spaces and convert the string to lowercase
    value = value.trim().toLowerCase();

    // Capitalize the first letter of the sentence
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

}
