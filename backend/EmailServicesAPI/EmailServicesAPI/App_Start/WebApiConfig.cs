using Newtonsoft.Json.Serialization;
// Using MIT License
// https://github.com/JamesNK/Newtonsoft.Json/blob/master/LICENSE.md

using System.Web.Http;
using System.Web.Http.Cors;

namespace EmailServicesAPI
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes();

            // Remove the default XML Configuration
            config.Formatters.XmlFormatter.SupportedMediaTypes.Clear();

            // Set the formatter to NetworkSoft Json Formatter
            config.Formatters.JsonFormatter.SerializerSettings.Formatting =
                Newtonsoft.Json.Formatting.Indented;

            // Config converting data in Camel Case
            config.Formatters.JsonFormatter.SerializerSettings.ContractResolver = 
                new CamelCasePropertyNamesContractResolver();

            EnableCrossSiteRequests(config);
            AddRoutes(config);

        }

        private static void AddRoutes(HttpConfiguration config)
        {

            config.Routes.MapHttpRoute(
            name: "DefaultApi",
            routeTemplate: "api/v1/{controller}/{id}",
            defaults: new { id = RouteParameter.Optional });

        }

        private static void EnableCrossSiteRequests(HttpConfiguration config)
        {
            var cors = new EnableCorsAttribute(
                origins: "*",
                headers: "*",
                methods: "*");
            config.EnableCors(cors);
        }
    }

}
