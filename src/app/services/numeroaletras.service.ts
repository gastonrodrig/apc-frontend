export function unidades(num: number): string {
    switch (num) {
      case 1:
        return 'Un'.toUpperCase();
      case 2:
        return 'Dos'.toUpperCase();
      case 3:
        return 'Tres'.toUpperCase();
      case 4:
        return 'Cuatro'.toUpperCase();
      case 5:
        return 'Cinco'.toUpperCase();
      case 6:
        return 'Seis'.toUpperCase();
      case 7:
        return 'Siete'.toUpperCase();
      case 8:
        return 'Ocho'.toUpperCase();
      case 9:
        return 'Nueve'.toUpperCase();
      default:
        return ''.toUpperCase();
    }
  }
  
  function decenasY(strSin: string, numUnidades: number): string {
    if (numUnidades > 0) {
      return (strSin + ' y ' + unidades(numUnidades)).toUpperCase();
    }
  
    return strSin.toUpperCase();
  }
  
  function decenas(num: number): string {
    const numDecena = Math.floor(num / 10);
    const numUnidad = num - numDecena * 10;
  
    switch (numDecena) {
      case 1:
        switch (numUnidad) {
          case 0:
            return 'Diez'.toUpperCase();
          case 1:
            return 'Once'.toUpperCase();
          case 2:
            return 'Doce'.toUpperCase();
          case 3:
            return 'Trece'.toUpperCase();
          case 4:
            return 'Catorce'.toUpperCase();
          case 5:
            return 'Quince'.toUpperCase();
          default:
            return ('Dieci' + unidades(numUnidad).toLowerCase()).toUpperCase();
        }
      case 2:
        switch (numUnidad) {
          case 0:
            return 'Veinte'.toUpperCase();
          default:
            return ('Veinti' + unidades(numUnidad).toLowerCase()).toUpperCase();
        }
      case 3:
        return decenasY('Treinta', numUnidad).toUpperCase();
      case 4:
        return decenasY('Cuarenta', numUnidad).toUpperCase();
      case 5:
        return decenasY('Cincuenta', numUnidad).toUpperCase();
      case 6:
        return decenasY('Sesenta', numUnidad).toUpperCase();
      case 7:
        return decenasY('Setenta', numUnidad).toUpperCase();
      case 8:
        return decenasY('Ochenta', numUnidad).toUpperCase();
      case 9:
        return decenasY('Noventa', numUnidad).toUpperCase();
      case 0:
        return unidades(numUnidad).toUpperCase();
      default:
        return ''.toUpperCase();
    }
  }
  
  function centenas(num: number): string {
    const numCentenas = Math.floor(num / 100);
    const numDecenas = num - numCentenas * 100;
  
    switch (numCentenas) {
      case 1:
        if (numDecenas > 0) {
          return ('Ciento ' + decenas(numDecenas)).toUpperCase();
        }
        return 'Cien'.toUpperCase();
      case 2:
        return ('Doscientos ' + decenas(numDecenas)).toUpperCase();
      case 3:
        return ('Trescientos ' + decenas(numDecenas)).toUpperCase();
      case 4:
        return ('Cuatrocientos ' + decenas(numDecenas)).toUpperCase();
      case 5:
        return ('Quinientos ' + decenas(numDecenas)).toUpperCase();
      case 6:
        return ('Seiscientos ' + decenas(numDecenas)).toUpperCase();
      case 7:
        return ('Setecientos ' + decenas(numDecenas)).toUpperCase();
      case 8:
        return ('Ochocientos ' + decenas(numDecenas)).toUpperCase();
      case 9:
        return ('Novecientos ' + decenas(numDecenas)).toUpperCase();
      default:
        return decenas(numDecenas).toUpperCase();
    }
  }
  
  function seccion(num: number, divisor: number, strSingular: string, strPlural: string): string {
    const numCientos = Math.floor(num / divisor);
    const numResto = num - numCientos * divisor;
  
    let letras = '';
  
    if (numCientos > 0) {
      if (numCientos > 1) {
        letras = (centenas(numCientos) + ' ' + strPlural).toUpperCase();
      } else {
        letras = strSingular.toUpperCase();
      }
    }
  
    if (numResto > 0) {
      letras += '';
    }
  
    return letras.toUpperCase();
  }
  
  function miles(num: number): string {
    const divisor = 1000;
    const numCientos = Math.floor(num / divisor);
    const numResto = num - numCientos * divisor;
    const strMiles = seccion(num, divisor, 'Un Mil', 'Mil');
    const strCentenas = centenas(numResto);
  
    if (strMiles === '') {
      return strCentenas.toUpperCase();
    }
  
    return (strMiles + ' ' + strCentenas).trim().toUpperCase();
  }
  
  function millones(num: number): string {
    const divisor = 1000000;
    const numCientos = Math.floor(num / divisor);
    const numResto = num - numCientos * divisor;
    const strMillones = seccion(num, divisor, 'Un Millón de', 'Millones de');
    const strMiles = miles(numResto);
  
    if (strMillones === '') {
      return strMiles.toUpperCase();
    }
  
    return (strMillones + ' ' + strMiles).trim().toUpperCase();
  }
  
  export function NumerosALetras(num: number): string {
    const data = {
      numero: num,
      enteros: Math.floor(num),
      centavos: Math.round(num * 100) - Math.floor(num) * 100,
      letrasCentavos: '',
      letrasMonedaPlural: 'SOLES',
      letrasMonedaSingular: 'SOL',
      letrasMonedaCentavoPlural: 'CENTIMOS',
      letrasMonedaCentavoSingular: 'CENTIMO'
    };
  
    if (data.centavos >= 0) {
      data.letrasCentavos = (() => {
        if (data.centavos >= 1 && data.centavos <= 9) {
          return ('0' + data.centavos + '/' + data.letrasMonedaCentavoSingular).toUpperCase();
        }
  
        if (data.centavos === 0) {
          return ('00/' + data.letrasMonedaCentavoSingular).toUpperCase();
        }
  
        return (data.centavos + '/' + data.letrasMonedaCentavoPlural).toUpperCase();
      })();
    }
  
    if (data.enteros === 0) {
      return ('Cero ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos).trim().toUpperCase();
    }
  
    if (data.enteros === 1) {
      return (millones(data.enteros) + ' ' + data.letrasMonedaSingular + ' ' + data.letrasCentavos).trim().toUpperCase();
    }
  
    return (millones(data.enteros) + ' ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos).trim().toUpperCase();
  }
  