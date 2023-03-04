﻿using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace ProEventosAPI.Helpers.IUtilRepository
{
    public interface IUtil
    {
        Task<string> SaveImage(IFormFile imageFile, string destino);
        void DeleteImage(string imageName, string destino);
    }
}
