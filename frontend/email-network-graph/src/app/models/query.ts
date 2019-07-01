export class Query{

    /**
     * 
     * Class Query
     *  
     * Purpose
     *  To provide a robust way to generate
     *  URL paths and add parameters without
     *  having to do a lot of string concatenation
     * 
     *  To provide an object oriented way to 
     *  deal with API Urls
     * 
     */

    // Private Fields
    private readonly OUR_PATH_SEPARATOR = '/';
    private readonly OUR_PARAM_SIGNIFIER = '?';
    private readonly OUR_PARAM_SEPARATOR = '&';
    private readonly OUR_PARAM_ASSIGNER = '=';

    private query : string;
    private addedParams : boolean = false;

    // Public Accessor 

    public getString(){
        return this.query;
    }

    // Public Mutators

    public set( otherQuery : string ){
        this.query = otherQuery;
    }

    public setUri(uri : string){

        if ( this.query ){

            return;

        } else {

            this.query = uri;
        }

    }

    public addPath( path: string ){

        this.query += this.OUR_PATH_SEPARATOR;
        this.query += path;

        if ( this.addedParams ){
            this.addedParams = false;
        }

    }

    public addParam( 
        
        accessor: string, 
        parameter: any 
        
        ) : void {

            if ( !this.addedParams ){
                this.query += this.OUR_PARAM_SIGNIFIER;
                this.addedParams = true;
            }
            else {
                this.query += this.OUR_PARAM_SEPARATOR;
            }

            this.query +=
                accessor 
                + this.OUR_PARAM_ASSIGNER
                + String( parameter ); 
    }
    

    // Ctor
    constructor( 

        url? : string,
        paths?: string,

        ){

        if ( url ){
            this.setUri( url );
        }

        if ( paths ){
            this.addPath( paths );
        }

    }

}