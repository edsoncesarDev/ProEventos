using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using ProEventos.Application.IRepositoryApplication;
using ProEventos.Application.RepositoryApplication;
using ProEventos.Domain.Identity;
using ProEventos.Persistence.Context;
using ProEventos.Persistence.IRepository;
using ProEventos.Persistence.Repository;
using ProEventosAPI.Helpers.IUtilRepository;
using ProEventosAPI.Helpers.UtilRepository;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Text.Json.Serialization;

namespace ProEventosAPI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<ProEventosContext>(context => 
                context.UseSqlServer(Configuration.GetConnectionString("Connection"))
            );

            //Identity
            services.AddIdentityCore<User>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = false;
                options.Password.RequiredLength = 4;
            })
            .AddRoles<Role>()
            .AddRoleManager<RoleManager<Role>>()
            .AddSignInManager<SignInManager<User>>()
            .AddRoleValidator<RoleValidator<Role>>()
            .AddEntityFrameworkStores<ProEventosContext>()
            .AddDefaultTokenProviders();

            //JWT
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                    .AddJwtBearer(options =>
                    {
                        options.TokenValidationParameters = new TokenValidationParameters
                        {
                            ValidateIssuerSigningKey = true,
                            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["TokenKey"])),
                            ValidateIssuer = false,
                            ValidateAudience = false
                        };
                    });



            services.AddControllers()
                    .AddJsonOptions(options => 
                        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter())
                    )
                    .AddNewtonsoftJson(options => 
                        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                    );

            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

            services.AddScoped<IEventoService, EventoService>();
            services.AddScoped<ILoteService, LoteService>();
            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IPalestranteService, PalestranteService>();
            services.AddScoped<IRedeSocialService, RedeSocialService>();
            services.AddScoped<IUtil, Util>();

            services.AddScoped<IGeralPersist, GeralPersist>();
            services.AddScoped<IEventoPersist, EventoPersist>();
            services.AddScoped<ILotePersist, LotePersist>();
            services.AddScoped<IPalestrantePersist, PalestrantePersist>();
            services.AddScoped<IRedeSocialPersist, RedeSocialPersist>();

            services.AddScoped<IUserPersist, UserPersist>();


            services.AddCors();
            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo { Title = "ProEventosAPI", Version = "v1" });
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = @"JWT Authorization header usando Bearer.
                                    Entre com 'Bearer ' [espa�o] e ent�o coloque seu token.
                                    Exemplo: 'Bearer 12345abcdef'",

                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });

                options.AddSecurityRequirement(new OpenApiSecurityRequirement()
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            },
                            Scheme = "oauth2",
                            Name = "Bearer",
                            In = ParameterLocation.Header
                        },

                        new List<string>()
                    }
                });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "ProEventosAPI v1"));
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseCors(cors => cors.AllowAnyHeader()
                                    .AllowAnyMethod()
                                    .AllowAnyOrigin());

            app.UseStaticFiles(new StaticFileOptions()
            {
                FileProvider = new PhysicalFileProvider(
                    Path.Combine(Directory.GetCurrentDirectory(), "Resources")),
                    RequestPath = new PathString("/Resources")
            });

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
