package com.soluvis.bake.system.controllers;

import java.io.IOException;
import java.util.List;

import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.chequer.axboot.core.api.response.Responses;
import com.chequer.axboot.core.parameter.RequestParams;
import com.soluvis.bake.common.controller.commController;
import com.soluvis.bake.system.domain.file.CommonFile;
import com.soluvis.bake.system.domain.file.CommonFileService;
import com.soluvis.bake.system.domain.file.UploadParameters;

@Controller
@RequestMapping(value = "/api/v1/files")
public class FileUploadController extends commController {

    @Inject
    private CommonFileService commonFileService;

    @RequestMapping(value = "/upload", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public CommonFile upload(
            @RequestParam(value = "file") MultipartFile multipartFile,
            @RequestParam(value = "targetType", required = false) String targetType,
            @RequestParam(value = "targetId", required = false) String targetId,
            @RequestParam(value = "sort", required = false, defaultValue = "0") int sort,
            @RequestParam(value = "deleteIfExist", required = false, defaultValue = "false") boolean deleteIfExist,
            @RequestParam(value = "desc", required = false) String desc,
            @RequestParam(value = "thumbnail", required = false, defaultValue = "false") boolean thumbnail,
            @RequestParam(value = "thumbnailWidth", required = false, defaultValue = "640") int thumbnailWidth,
            @RequestParam(value = "thumbnailHeight", required = false, defaultValue = "640") int thumbnailHeight) throws IOException {

        UploadParameters uploadParameters = new UploadParameters();
        uploadParameters.setMultipartFile(multipartFile);
        uploadParameters.setTargetType(targetType);
        uploadParameters.setTargetId(targetId);
        uploadParameters.setSort(sort);
        uploadParameters.setDeleteIfExist(deleteIfExist);
        uploadParameters.setDesc(desc);
        uploadParameters.setThumbnail(thumbnail);
        uploadParameters.setThumbnailWidth(thumbnailWidth);
        uploadParameters.setThumbnailHeight(thumbnailHeight);

        return commonFileService.upload(uploadParameters);
    }

    @RequestMapping(method = RequestMethod.GET, produces = APPLICATION_JSON)
    public Responses.PageResponse list(RequestParams<CommonFile> requestParams) {
        Page<CommonFile> files = commonFileService.getList(requestParams);
        return Responses.PageResponse.of(files);
    }

    @RequestMapping(method = RequestMethod.POST, produces = APPLICATION_JSON)
    public List<CommonFile> updateOrDelete(@RequestBody List<CommonFile> file) {
        commonFileService.updateOrDelete(file);
        return file;
    }

    @RequestMapping(value = "/preview", method = RequestMethod.GET)
    public void preview(HttpServletResponse response, @RequestParam Long id) throws IOException {
        commonFileService.preview(response, id);
    }

    @RequestMapping(value = "/thumbnail", method = RequestMethod.GET)
    public void thumbnail(HttpServletResponse response, @RequestParam Long id) throws IOException {
        commonFileService.thumbnail(response, id);
    }

    @RequestMapping(value = "/download", method = RequestMethod.GET)
    public ResponseEntity<byte[]> download(@RequestParam Long id) throws IOException {
        return commonFileService.downloadById(id);
    }

    @RequestMapping(value = "/download", method = RequestMethod.GET, params = {"targetType", "targetId"})
    public ResponseEntity<byte[]> downloadByTargetTypeAndTargetId(@RequestParam String targetType, @RequestParam String targetId) throws IOException {
        return commonFileService.downloadByTargetTypeAndTargetId(targetType, targetId);
    }
}
