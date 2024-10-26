
export interface Theme {
  primary     : string;
  primaryBg   : string;
  secondary   : string;
  secondaryBg : string;
}

export class DarkTheme implements Theme {
  primary     : string  = "#FFF" ;
  primaryBg   : string  = "#000" ;
  secondary   : string  = "#FF7" ;
  secondaryBg : string  = "#004" ;
}

export class LigthTheme implements Theme {
  primary     : string  = "#000" ;
  primaryBg   : string  = "#FFF" ;
  secondary   : string  = "#004" ;
  secondaryBg : string  = "#FF7" ;
}

export interface StateProps {
  theme : Theme;
}

export class State implements StateProps {
  
  theme: Theme;

  constructor(props : StateProps) {
    this.theme = props.theme;
  }
  
}

export default new State({theme : new DarkTheme()});
